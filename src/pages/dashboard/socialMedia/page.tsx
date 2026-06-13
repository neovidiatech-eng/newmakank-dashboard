import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import SocialMediaColumns from './SocialMediaColumns';

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Social Media"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["socialMedia"]}
        columns={SocialMediaColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("SocialMedia")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["socialMedia"] : undefined,
          //onInfo: true,
        }}
        filters={[{ "name": "platform", "type": "text", "width": 3 }]}
      />
    </>
  );
}
