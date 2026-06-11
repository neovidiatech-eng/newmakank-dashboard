import TableBasic from "@/components/common/table/TableBasic";
import { useTranslations } from "@/lib/i18n";
import BannerStatsAction from "./BannerStatsAction";
import BannersColumns from "./BannersColumns";

export default function BannersTable({
  data,
  total,
  canCreate,
  canEdit,
  canDelete
}: {
  data: Record<string, unknown>[];
  total: number;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  const t = useTranslations();
  const columns = BannersColumns();

  return (
    <TableBasic
      data={data}
      hideCreateNew={!canCreate}
      columns={columns}
      pagination={{
        total
      }}
      tableActions={{
        onEdit: canEdit,
        onDelete: canDelete ? ["banners"] : undefined,
        renderRowActions: rowData => <BannerStatsAction rowData={rowData} />
      }}
      cardHeader={t("Banners")}
      filters={[{ name: "name", type: "text", width: 3 }]}
    />
  );
}
