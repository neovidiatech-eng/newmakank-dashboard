import { Link } from "@/lib/navigation";
import { useTranslations } from "@/lib/i18n";
import { FaChevronLeft } from "react-icons/fa";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label, className }: BackButtonProps) {
  const t = useTranslations();

  return (
    <Link
      href={href ?? "/dashboard"}
      className={`inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors ${className || ""}`}
    >
      <FaChevronLeft size={12} />
      <span>{label || t("Back")}</span>
    </Link>
  );
}
