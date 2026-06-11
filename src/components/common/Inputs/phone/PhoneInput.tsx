import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Comprehensive styles to override react-phone-input-2 default ugly styles
// and make it look like a native Shadcn/Tailwind component.
const customStyles = `
  /* General Container Override */
  .react-tel-input .form-control {
    width: 100% !important;
    height: 2.75rem !important; /* h-11 */
    font-size: 0.875rem !important; /* text-sm */
    line-height: 1.25rem !important;
    padding-left: 3.5rem !important; /* space for flag */
    border-radius: 9999px !important; /* rounded-full */
    border: 1px solid hsl(var(--input)) !important;
    background-color: hsl(var(--background)) !important;
    color: hsl(var(--foreground)) !important;
    transition: all 0.2s ease-in-out !important;
  }

  /* Focus State */
  .react-tel-input .form-control:focus {
    border-color: hsl(var(--ring)) !important;
    box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2) !important;
    outline: none !important;
  }

  /* Flag Section Override */
  .react-tel-input .flag-dropdown {
    border: none !important;
    background-color: transparent !important;
    border-radius: 9999px 0 0 9999px !important;
    padding-left: 0.5rem !important;
  }

  .react-tel-input .selected-flag {
    background-color: transparent !important;
    border-radius: 9999px 0 0 9999px !important;
    padding: 0 0.5rem !important;
    width: 38px !important;
    transition: background-color 0.2s;
  }

  .react-tel-input .selected-flag:hover,
  .react-tel-input .selected-flag.open {
    background-color: hsl(var(--muted)) !important;
  }

  .react-tel-input .selected-flag .arrow {
    border-top-color: hsl(var(--muted-foreground)) !important;
  }

  .react-tel-input .selected-flag.open .arrow {
    border-top-color: hsl(var(--primary)) !important;
  }

  /* Dropdown Menu Override */
  .react-tel-input .country-list {
    background-color: hsl(var(--popover)) !important;
    color: hsl(var(--popover-foreground)) !important;
    border: 1px solid hsl(var(--border)) !important;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05) !important;
    border-radius: 0.75rem !important;
    margin-top: 0.5rem !important;
    width: 280px !important;
    max-height: 250px !important;
    z-index: 100 !important;
    
    /* Scrollbar styling for the list */
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;
  }

  /* Dark mode specific shadow */
  .dark .react-tel-input .country-list {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -2px rgb(0 0 0 / 0.3) !important;
  }

  .react-tel-input .country-list::-webkit-scrollbar {
    width: 6px;
  }
  .react-tel-input .country-list::-webkit-scrollbar-thumb {
    background-color: hsl(var(--muted-foreground) / 0.3);
    border-radius: 9999px;
  }

  /* Dropdown Items */
  .react-tel-input .country-list .country {
    padding: 0.625rem 0.75rem !important;
    transition: background-color 0.15s ease;
    display: flex !important;
    align-items: center !important;
    gap: 0.75rem !important;
  }

  .react-tel-input .country-list .country:hover {
    background-color: hsl(var(--muted)) !important;
  }

  .react-tel-input .country-list .country.highlight {
    background-color: hsl(var(--accent)) !important;
    color: hsl(var(--accent-foreground)) !important;
  }

  .react-tel-input .country-list .country .dial-code {
    color: hsl(var(--muted-foreground)) !important;
    font-size: 0.8rem;
  }
  
  /* Search Box */
  .react-tel-input .search {
    background-color: hsl(var(--popover)) !important;
    padding: 8px !important;
    position: sticky !important;
    top: 0;
    z-index: 1;
    border-bottom: 1px solid hsl(var(--border)) !important;
  }

  .react-tel-input .search-box {
    margin: 0 !important;
    width: 100% !important;
    border: 1px solid hsl(var(--input)) !important;
    background-color: hsl(var(--background)) !important;
    color: hsl(var(--foreground)) !important;
    border-radius: 0.5rem !important;
    padding: 0.5rem !important;
    height: 2rem !important;
    font-size: 0.875rem !important;
  }
  
  .react-tel-input .search-box::placeholder {
    color: hsl(var(--muted-foreground)) !important;
  }
`;

const CustomPhoneInput = ({
  name,
  placeholder = "",
  disabled,
  value,
  onChange,
  inputClassName = ""
}: {
  value?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  inputClassName?: string;
}) => {
  const [phoneValue, setPhoneValue] = useState(value || "");
  const [country, setCountry] = useState("eg");

  const handleChange = (inputValue: string, countryData: any) => {
    setPhoneValue(inputValue);

    // Update internal country state
    if (countryData && countryData.countryCode) {
      setCountry(countryData.countryCode);
    }

    onChange("+" + inputValue);
  };

  // Inject styles globally for this component
  useEffect(() => {
    const styleId = "react-phone-input-custom-styles";
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.innerHTML = customStyles;
      document.head.appendChild(styleElement);

      return () => {
        const styleTag = document.getElementById(styleId);
        if (styleTag) {
          document.head.removeChild(styleTag);
        }
      };
    }
  }, []);

  return (
    <div className="w-full relative group">
      <div dir="ltr" className="w-full">
        <PhoneInput
          autoFormat
          enableAreaCodeStretch
          enableSearch
          disableSearchIcon
          value={phoneValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder || "Enter phone number"}
          containerClass="!w-full"
          dropdownClass="!w-full"
          inputClass={inputClassName}
          countryCodeEditable
          inputProps={{
            name: name,
            required: true,
            autoFocus: false
          }}
          country={country}
          preferredCountries={["sa", "ae", "us", "gb", "eg"]}
          excludeCountries={["il"]}
        />
      </div>
    </div>
  );
};

export default CustomPhoneInput;
