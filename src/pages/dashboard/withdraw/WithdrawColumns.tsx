import { PriceAmount } from "@/components/PriceAmount";
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import ChangeStatusTableAction from "@/components/common/table/tableActions/ChangeStatusTableAction";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import { type ColumnDef } from "@tanstack/react-table";

export default function WithdrawColumns(): ColumnDef<Record<string, unknown>>[] {
  const columns = [
    {
      accessorKey: "StoreAccount.name.ar",
      header: () => <IconHeader columnKey="StoreAccount > Name > Ar" />,
      cell: ({ row }) => {
        const value = row.original.StoreAccount?.name?.ar;
        return <span>{value || "-"}</span>;
      }
    },
    {
      accessorKey: "amount",
      header: () => <IconHeader columnKey="Amount" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
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
        console.log(status);
        return <TableStatusBadge status={status} />;
      }
    },
    {
      accessorKey: "StoreAccount.Bank.name",
      header: () => <IconHeader key="StoreAccount > Bank > Name" columnKey="StoreAccount > Bank > Name" />,
      cell: ({ row }) => {
        const en = row.original.StoreAccount?.Bank?.name?.en as string;
        const ar = row.original.StoreAccount?.Bank?.name?.ar as string;
        return (
          <LocaleViewColumn value={{ en, ar }} />
        );
      }
    },
    {
      accessorKey: "StoreAccount.Branch.name",
      header: () => <IconHeader key="StoreAccount > Branch > Name" columnKey="StoreAccount > Branch > Name" />,
      cell: ({ row }) => {
        const en = row.original.StoreAccount?.Branch?.name?.en as string;
        const ar = row.original.StoreAccount?.Branch?.name?.ar as string;
        return (
          <LocaleViewColumn value={{ en, ar }} />
        );
      }
    },
    {
      accessorKey: "id",
      header: () => <IconHeader columnKey="status" />,
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
