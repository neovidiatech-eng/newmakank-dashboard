'use client'
import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import { type ColumnDef } from "@tanstack/react-table";

export default function PermissionsColumns(): ColumnDef<Record<string, unknown>>[] {

    const columns = [

        {
            accessorKey: "name",
            header: () => <IconHeader key="name" columnKey="Name" />,
            cell: ({ row }) => {
                const en = row.original.name?.en as string;
                const ar = row.original.name?.ar as string;
                return (
                    <LocaleViewColumn value={{ en, ar }} />
                );
            }
        },
        {
            accessorKey: "prefix",
            header: () => <IconHeader columnKey="Prefix" />,
            cell: ({ getValue }) => <span>{getValue() as string}</span>
        },
        {
            accessorKey: "method",
            header: () => <IconHeader columnKey="Method" />,
            cell: ({ getValue }) => {
                const methods = getValue() as string[];
                return (
                    <div className="flex flex-wrap gap-1">
                        {methods.map((method) => (
                            <TableStatusBadge key={method} status={method} >
                            </TableStatusBadge>
                        ))}
                    </div>
                );
            }
        }
    ];

    return columns;
}
