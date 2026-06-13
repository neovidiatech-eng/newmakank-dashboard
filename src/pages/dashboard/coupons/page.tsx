import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import CouponsColumns from './CouponsColumns';

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Coupons"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["coupons"]}
        columns={CouponsColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Coupons")}
        tableActions={{
          onEdit: false,
          // onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["coupons"] : undefined,
          onInfo: true,
        }}
        filters={[{ name: "title", type: "text", width: 3 }]}
      />
    </>
  );
}
