import { useTranslations } from "@/lib/i18n";

export default function ActiveCol({ value }: { value: boolean }) {
  const t = useTranslations();
  return (
    <div className="flex justify-center font-medium text-[15px] text-gray-800 items-center">
      <div className={` rounded-md ${value ? "bg-green-400" : "bg-red-400"} py-1`}>
        <span className="px-3 text-nowrap font-normal">{value ? t("Active") : t("Inactive")}</span>
      </div>
    </div>
  );
}
