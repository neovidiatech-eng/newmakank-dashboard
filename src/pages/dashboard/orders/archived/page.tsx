import CustomHeader from "@/components/layouts/header/CustomHeader";
import ArchivedOrdersView from "./ArchivedOrdersView";
import { getTranslations } from "@/lib/i18n";
import ModuleSelector from "@/components/common/selectors/ModuleSelector";
import { Suspense } from "react";

export default async function page(): Promise<JSX.Element> {
  const t = await getTranslations();

  return (
    <>
      <CustomHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <Suspense fallback={null}>
            <ModuleSelector />
          </Suspense>
        </div>
      </CustomHeader>
      <ArchivedOrdersView tableTitle={t("Archived Orders")} />
    </>
  );
}
