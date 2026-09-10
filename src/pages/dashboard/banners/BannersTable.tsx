import TableBasic from "@/components/common/table/TableBasic";
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { useTranslations } from "@/lib/i18n";
import BannerStatsAction from "./BannerStatsAction";
import BannersColumns from "./BannersColumns";

export default function BannersTable({
  data,
  total,
  canCreate,
  canEdit,
  canDelete,
  filters
}: {
  data: Record<string, unknown>[];
  total: number;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  filters?: FormInput[];
}) {
  const t = useTranslations();
  const columns = BannersColumns();

  const defaultFilters: FormInput[] = [
    { name: "name", type: "text", width: 3 },
    {
      name: "zoneId",
      key: "zoneId",
      type: "selectPaginated",
      apiUrl: ["zones"],
      endPoint: ["zones"],
      placeholder: "المنطقة",
      labelKey: "name",
      valueKey: "id",
      idKey: "id",
      width: 3
    } as any
  ];

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
      filters={filters ?? defaultFilters}
    />
  );
}
