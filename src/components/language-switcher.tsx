// components/LanguageDropdown.tsx
import { usePathname, useRouter, useSearchParams } from "@/lib/navigation";
import { useSetLocale } from "@/lib/i18n";
import { MdLanguage } from "react-icons/md";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setLocale = useSetLocale();

  const changeLocale = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "ar" || segments[0] === "en") {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }

    const newUrl = `/${segments.join("/")}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    setLocale(newLocale);
    router.push(newUrl);
  };

  const handleToggleLocale = () => {
    const currentLocale = pathname.split("/")[1] || "en";
    const nextLocale = currentLocale === "ar" ? "en" : "ar";
    changeLocale(nextLocale);
  };

  return (
    <div className="relative z-50">
      <button
        onClick={handleToggleLocale}
        className="flex items-center justify-center w-8 h-8 rounded hover:bg-primary/20 cursor-pointer"
      >
        <MdLanguage className="text-2xl text-gray-500" />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
