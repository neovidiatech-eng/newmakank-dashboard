import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import StoresColumns from "./StoresColumns";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Stores"];
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <CustomHeader />
      <div className="flex items-center gap-2 mb-4">
        <Link href="/stores">
          <Badge variant={!resolvedSearchParams?.isStoreAccepted ? "default" : "outline"} className="cursor-pointer px-3 py-1.5">
            {t("Stores")}
          </Badge>
        </Link>
        <Link href="/stores?isStoreAccepted=false">
          <Badge variant={resolvedSearchParams?.isStoreAccepted === "false" ? "default" : "outline"} className="cursor-pointer px-3 py-1.5">
            {t("Pending Review")}
          </Badge>
        </Link>
      </div>
      <TableWithQuery
        endPoint={["stores"]}
        columns={StoresColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Stores")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["stores"] : undefined,
          onInfo: true,
          fixedActions: true,
        }}
        filters={[{ name: "name", type: "text", width: 3 }, {
          name: 'categoryId',
          type: 'selectPaginated',
          isMulti: true,
          apiUrl: ["categories"]
        },
        {
          name: "isStoreAccepted",
          type: "select",
          width: 3,
          options: [
            { label: t("Approve"), value: "true" },
            { label: t("Pending Review"), value: "false" }
          ]
        }
        ]}
      />
    </>
  );
}
