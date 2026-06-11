import { useEffect } from "react";
import type { FormLangs } from "./CustomFormTypes.types";

const langOptions: {
  value: "En" | "Ar" | "default";
  label: string;
}[] = [
    { value: "Ar", label: "العربية" },
    { value: "En", label: "English" }
    // { value: "default", label: "default" }
  ];

const styles = {
  languageButton: {
    padding: "5px 10px",
    margin: "0 5px",
    border: "none",
    borderBottom: "2px solid transparent",
    backgroundColor: "transparent",
    cursor: "pointer"
  },
  activeButton: {
    borderBottom: "2.5px solid red"
  }
};

export default function InputLangSwitcher({
  selectedLang,
  setSelectedLang,
  changeLang,
  hideDefault = false
}: {
  selectedLang: FormLangs;
  changeLang?: FormLangs;
  hideDefault?: boolean;
  setSelectedLang: (lang: FormLangs) => void;
}) {
  if (hideDefault && langOptions.length === 3) {
    langOptions.pop();
  }
  const handleLangChange = (lang: FormLangs) => {
    setSelectedLang(lang);
  };
  useEffect(() => {
    if (changeLang === "changeToAr") {
      handleLangChange("Ar");
    }
    if (changeLang === "changeToEn") {
      handleLangChange("En");
    }
    if (changeLang === "changeToDefault") {
      handleLangChange("default");
    }
  }, [changeLang]);
  return (
    <div className="col-span-6 mt-2">
      {langOptions.map(lang => (
        <button
          type="button"
          key={lang.value}
          data-testid={`lang-${lang.value}`}
          onClick={() => handleLangChange(lang.value as FormLangs)}
          style={{
            ...styles.languageButton,
            ...(selectedLang === lang.value ? styles.activeButton : {})
          }}
        >
          {lang.label}
        </button>
      ))}
      <hr />
    </div>
  );
}
