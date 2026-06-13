import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import VariationTemplateColumns from "./VariationTemplateColumns";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.[""];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["variationTemplate"]}
        columns={VariationTemplateColumns}
        
        cardHeader={t("VariationTemplate")}
        tableActions={{
          onEdit: false,
          onDelete: ["variationTemplate"]
          //onInfo: true,
        }}
        filters={[{ name: "name", type: "text", width: 3 }]}
      />
    </>
  );
}
