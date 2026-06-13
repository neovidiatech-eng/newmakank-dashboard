import CustomHeader from "@/components/layouts/header/CustomHeader";
import CategoryFilter from "@/components/common/category/CategoryFilter";
import ModuleSelector from "@/components/common/selectors/ModuleSelector";
import OrdersViewTabs from "@/components/pages/_orders/OrdersViewTabs";
import { getTranslations } from "@/lib/i18n";

export default async function page(): Promise<JSX.Element> {
  const t = await getTranslations();

  return (
    <>
      <CustomHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <ModuleSelector />
        </div>
      </CustomHeader>
      <CategoryFilter className="flex-1 flex-wrap" />
      <OrdersViewTabs tableTitle={t("Orders")} endPoint={["orders"]} />
    </>
  );
}
