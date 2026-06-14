import CustomHeader from "@/components/layouts/header/CustomHeader";
import CustomerCategoriesForm from "@/components/pages/_customerCategories/CustomerCategoriesForm";
import { getTranslations } from "@/lib/i18n";

export default async function page() {
  const t = await getTranslations();

  return (
    <>
      <CustomHeader
        items={[
          { label: t("customerCategories"), href: "/customer-categories" },
          { label: t("add_new"), href: "/customer-categories/create" }
        ]}
      />
      <div className="md:p-10 p-5 mt-10 rounded-2xl border bg-background">
        <CustomerCategoriesForm /> 
      </div>
    </> 

  );
}
