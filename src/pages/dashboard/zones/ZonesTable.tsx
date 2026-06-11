import TableBasic from "@/components/common/table/TableBasic";
import { useTranslations } from "@/lib/i18n";
import ZonesColumns from "./ZonesColumns";
import ZonesExpandedRow from "./ZonesExpandedRow";

interface ZonesTableProps {
  data: any[];
  total: number;
  permission?: Auth.PermissionsType;
}

export default function ZonesTable({ data, total, permission }: ZonesTableProps) {
  const t = useTranslations();

  return (
    <TableBasic
      data={data}
      columns={ZonesColumns}
      pagination={{
        total: total
      }}
      tableActions={{
        onEdit: permission?.put || permission?.patch,
        onDelete: permission?.delete ? ["zones"] : undefined
        //onInfo: true,
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
