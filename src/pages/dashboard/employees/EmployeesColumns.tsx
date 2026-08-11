import PhoneDirectionCol from "@/components/common/table/columns/Phone.direction";
import DateCol from "@/components/common/table/columns/date.column";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import { type ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "@/lib/i18n";
import { employeesEntity } from "./types";

export default function EmployeesColumns(): ColumnDef<employeesEntity>[] {
    const t = useTranslations();

    const columns = [
        {
            accessorKey: "id",
            header: t("Id") || "Id",
            cell: ({ getValue }) => <span>{getValue() as string}</span>
        },
        {
            accessorKey: "name",
            header: t("Name") || "Name",
            cell: ({ getValue }) => <span>{getValue() as string}</span>
        },
        {
            accessorKey: "email",
            header: t("Email") || "Email",
            cell: ({ getValue }) => <span>{getValue() as string}</span>
        },
        {
            accessorKey: "phone",
            header: t("Phone") || "Phone",
            cell: ({ getValue }) => <PhoneDirectionCol value={getValue() as string} />
        },
        {
            accessorKey: "Role.name",
            header: t("Role") || "Role",
            cell: ({ row }) => {
                const name = row.original.Role?.name as any;
                return <span>{name?.ar || name?.en || "-"}</span>;
            }
        },
        {
            accessorKey: "image",
            header: t("Image") || "Image",
            cell: ({ getValue }) => {
                const image = getValue() as string;
                return (
                    <div className="flex items-center justify-center w-full h-12 overflow-hidden">
                        <ImageCell cell={image} />
                    </div>
                );
            }
        },
        {
            accessorKey: "createdAt",
            header: t("CreatedAt") || "CreatedAt",
            cell: ({ getValue }) => {
                return (
                    <DateCol date={getValue()} />
                );
            }
        },

    ];

    return columns;
}
