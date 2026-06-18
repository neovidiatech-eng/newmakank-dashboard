import CustomHeader from "@/components/layouts/header/CustomHeader";
import ArchivedOrdersView from "./ArchivedOrdersView";
import { getTranslations } from "@/lib/i18n";

export default async function page(): Promise<JSX.Element> {
  const t = await getTranslations();

  return (
    <>
      <CustomHeader />
      <ArchivedOrdersView tableTitle={t("Archived Orders")} />
    </>
  );
}
