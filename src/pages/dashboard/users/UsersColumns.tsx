import PhoneDirectionCol from "@/components/common/table/columns/Phone.direction";
import DateCol from "@/components/common/table/columns/date.column";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import { type ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "@/lib/i18n";
import { usersEntity } from "./types";

export default function UsersColumns(): ColumnDef<usersEntity>[] {
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
            accessorKey: "roleKey",
            header: t("RoleKey") || "RoleKey",
            cell: ({ getValue }) => <span>{getValue() as string}</span>
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
            accessorKey: "orderStats",
            header: t("Order Stats") || "إحصائيات الطلبات",
            cell: ({ row }) => {
                const stats = (row.original as any)?.orderStats;
                if (!stats) return <span className="text-muted-foreground">-</span>;
                return (
                    <div className="flex flex-col gap-1 text-xs py-1">
                        <div className="flex items-center gap-1.5">
                            <span className="font-medium text-muted-foreground">{t("Total Orders")}:</span>
                            <span className="font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                                {stats.totalOrders ?? 0}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold" title={t("Completed Orders")}>
                                ✓ {stats.completedOrders ?? 0}
                            </span>
                            <span className="text-rose-500 font-semibold" title={t("Cancelled Orders")}>
                                ✗ {stats.cancelledOrders ?? 0}
                            </span>
                        </div>
                        {stats.totalSpent > 0 && (
                            <div className="font-medium text-amber-600 dark:text-amber-400 text-xs">
                                {stats.totalSpent} EGP
                            </div>
                        )}
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
