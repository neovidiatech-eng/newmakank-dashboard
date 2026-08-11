import TableBasic from "@/components/common/table/TableBasic";
import { useTranslations } from "@/lib/i18n";
import SpecialDeliveryBannerStatsAction from "./SpecialDeliveryBannerStatsAction";
import SpecialDeliveryBannersColumns from "./SpecialDeliveryBannersColumns";

export default function SpecialDeliveryBannersTable({
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
  const columns = SpecialDeliveryBannersColumns();

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
        onDelete: canDelete ? ["specialDeliveryBanners"] : undefined,
        renderRowActions: rowData => <SpecialDeliveryBannerStatsAction rowData={rowData} />
      }}
      cardHeader={t("Special Delivery Banners")}
      filters={[{ name: "name", type: "text", width: 3 }]}
    />
  );
}
