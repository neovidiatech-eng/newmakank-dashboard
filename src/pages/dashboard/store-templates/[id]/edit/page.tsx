import { fetchData } from "@/api/global/fetchData";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import StoreTemplatesForm from "@/components/pages/_storeTemplates/StoreTemplatesForm";
import { getTranslations } from "@/lib/i18n";
import { notFound } from "@/lib/navigation";

export default async function page({ params }: { params: Params }): Promise<JSX.Element> {
  const { id } = await params;
  const t = await getTranslations();
  const data = await fetchData(["storeTemplates", Number(id)]);

  if (!data?.data) {
    return notFound();
  }

  return (
    <>
      <CustomHeader
        items={[
          { label: t("storeTemplates"), href: "/store-templates" },
          { label: t("edit"), href: `/store-templates/${id}/edit` }
        ]}
      />
      <div className="md:p-10 p-5 mt-10 rounded-2xl border bg-background">
        <StoreTemplatesForm data={data.data} />
      </div>
    </>
  );
}
