import TableBasic from "@/components/common/table/TableBasic";
import ZonesColumns from "./ZonesColumns";
import ZonesExpandedRow from "./ZonesExpandedRow";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useSearchParams } from "@/lib/navigation";
import { useTranslations } from "@/lib/i18n";

interface ZonesTableProps {
  permission?: Auth.PermissionsType;
}

export default function ZonesTable({ permission }: ZonesTableProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const params: Record<string, unknown> = {};
  searchParams.forEach((value, key) => { params[key] = value; });

  const { data: response } = useApiQuery({
    queryKey: ["zones", JSON.stringify(params)],
    endPoint: ["zones"],
    params,
    staleTime: 0
  });

  const data: any[] = Array.isArray(response?.data) ? response.data : [];
  const total = response?.total ?? data.length;

  return (
    <TableBasic
      data={data}
      columns={ZonesColumns}
      pagination={{ total }}
      tableActions={{
        onEdit: permission?.put || permission?.patch,
        onDelete: permission?.delete ? ["zones"] : undefined
      }}
      expandable={{
        ExpandedRowComponent: ZonesExpandedRow,
      }}
      hideCreateNew={!permission?.post}
      cardHeader={t("Zones")}
      filters={[{ name: "name", type: "text", width: 3 }]}
    />
  );
}
