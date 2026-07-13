import { PriceAmount } from "@/components/PriceAmount";
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import ChangeStatusTableAction from "@/components/common/table/tableActions/ChangeStatusTableAction";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import { type ColumnDef } from "@tanstack/react-table";

// The BankAccount/Bank system was removed from the backend — withdrawals no longer carry a
// StoreAccount relation. The response shape is now flat: { amount, branchId, payoutMethod,
// payoutDetails, status, createdAt, Branch? }.
export default function WithdrawColumns(): ColumnDef<Record<string, unknown>>[] {
  const columns = [
    {
      accessorKey: "Branch.name",
      header: () => <IconHeader columnKey="Branch" />,
      cell: ({ row }) => {
        const branch = row.original.Branch as { name?: { en?: string; ar?: string } } | undefined;
        if (branch?.name) {
          return <LocaleViewColumn value={{ en: branch.name.en, ar: branch.name.ar }} />;
        }
        const branchId = row.original.branchId as number | undefined;
        return <span>{branchId ? `#${branchId}` : "-"}</span>;
      }
    },
    {
      accessorKey: "amount",
      header: () => <IconHeader columnKey="Amount" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "payoutMethod",
      header: () => <IconHeader columnKey="payoutMethod" />,
      cell: ({ getValue }) => <TableStatusBadge status={getValue() as string} />
    },
    {
      accessorKey: "payoutDetails",
      header: () => <IconHeader columnKey="payoutDetails" />,
      cell: ({ getValue }) => <span>{(getValue() as string) || "-"}</span>
    },
    {
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => {
        return <DateCol date={getValue()} />;
      }
    },
    {
      accessorKey: "status",
      header: () => <IconHeader columnKey="Status" />,
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return <TableStatusBadge status={status} />;
      }
    },
    {
      accessorKey: "id",
      header: () => <IconHeader columnKey="Actions" />,
      cell: ({ getValue, row }) => (
        <>
          <ChangeStatusTableAction
            status={row.original.status}
            statusKey={"status"}
            type={"select"}
            endpoint={["withdraw", getValue() as number]}
            options={["APPROVED", "DENIED"]}
          />
        </>
      )
    }
  ];

  return columns;
}
