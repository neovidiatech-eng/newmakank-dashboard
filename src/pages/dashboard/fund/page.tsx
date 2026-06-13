import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import FundColumns from './FundColumns';

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.[""];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["fund"]}
        columns={FundColumns}
        
        cardHeader={t("Fund")}
        
        filters={[{ "name": "name", "type": "text", "width": 3 }]}
      />
    </>
  );
}
