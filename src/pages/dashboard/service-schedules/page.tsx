import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import ServiceSchedulesClient from "./ServiceSchedulesClient";

export default async function ServiceSchedulesPage(): Promise<JSX.Element> {
  const t = await getTranslations();

  return (
    <>
      <CustomHeader />
      <div className="grid gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("serviceSchedules")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("serviceSchedulesDesc")}
          </p>
        </div>
        <ServiceSchedulesClient />
      </div>
    </>
  );
}
