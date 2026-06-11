import { EmptyState } from "@/components/ui/dashboard-primitives";
import { useTranslations } from "@/lib/i18n";
import { FiAlertCircle } from "react-icons/fi";

export default function TableNoData({
  message,
}: {
  message?: string;
}): JSX.Element {
  const t = useTranslations();
  return (
    <EmptyState
      icon={FiAlertCircle}
      title={t("No Data Found")}
      description={message ? t(message) : t("Please add some data to see it here")}
    />
  );
}
