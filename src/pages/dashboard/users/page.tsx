import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import UsersColumns from './UsersColumns';

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Users"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["users"]}
        columns={UsersColumns as any}
        hideCreateNew={!permission?.post}
        cardHeader={t("Users")}
        extraParams={{ includeStats: true }}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["users"] : undefined,
          //onInfo: true,
        }}
        filters={[
          { name: "name", type: "text", width: 3 },
          {
            name: "orderFilter",
            type: "select",
            width: 3,
            label: t("Order Filter"),
            options: [
              { label: t("Most Orders"), value: "MOST_ORDERS" },
              { label: t("Least Orders"), value: "LEAST_ORDERS" },
              { label: t("Zero Orders"), value: "ZERO_ORDERS" },
              { label: t("Most Cancelled"), value: "MOST_CANCELLED" }
            ]
          },
          {
            name: "zeroOrdersOnly",
            type: "select",
            width: 3,
            label: t("Zero Orders Only"),
            options: [
              { label: t("Yes"), value: "true" },
              { label: t("No"), value: "false" }
            ]
          }
        ]}
      />
    </>
  );
}
