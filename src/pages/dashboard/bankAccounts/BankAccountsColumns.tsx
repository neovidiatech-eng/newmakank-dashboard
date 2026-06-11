import EntityInfoCell from "@/components/common/table/columns/entity-info-cell";
import IconHeader from "@/components/common/table/columns/icon-header";
import { type ColumnDef } from "@tanstack/react-table";

export default function BankAccountsColumns(): ColumnDef<Record<string, unknown>>[] {
  const columns = [
    {
      id: "bankInfo",
      header: () => <IconHeader columnKey="Bank Info" />,
      cell: ({ row }) => {
        const nameAr = row.original.Bank?.name?.ar as string | undefined;
        const nameEn = row.original.Bank?.name?.en as string | undefined;
        return (
          <EntityInfoCell
            name={nameEn || nameAr}
            email={nameEn && nameAr ? nameAr : undefined}
            phone={row.original.phone as string | null | undefined}
          />
        );
      }
    },
    {
      accessorKey: "ibn",
      header: () => <IconHeader columnKey="Ibn" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    }
  ];

  return columns;
}
