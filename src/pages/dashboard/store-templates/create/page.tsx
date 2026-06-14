import CustomHeader from "@/components/layouts/header/CustomHeader";
import StoreTemplatesForm from "@/components/pages/_storeTemplates/StoreTemplatesForm";
import { getTranslations } from "@/lib/i18n";

export default async function page() {
  const t = await getTranslations();

  return (
    <>
      <CustomHeader
        items={[
          { label: t("storeTemplates"), href: "/store-templates" },
          { label: t("add_new"), href: "/store-templates/create" }
        ]}
      />
      <div className="md:p-10 p-5 mt-10 rounded-2xl border bg-background">
        <StoreTemplatesForm />
      </div>
    </>
  );
}
