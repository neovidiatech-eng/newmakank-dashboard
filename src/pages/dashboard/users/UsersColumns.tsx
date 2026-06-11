'use client'
import PhoneDirectionCol from "@/components/common/table/columns/Phone.direction";
import DateCol from "@/components/common/table/columns/date.column";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import { type ColumnDef } from "@tanstack/react-table";
import { usersEntity } from "./types";

export default function UsersColumns(): ColumnDef<usersEntity>[] {

    const columns = [
        {
            accessorKey: "id",
            header: "Id",
            cell: ({ getValue }) => <span>{getValue() as string}</span>
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ getValue }) => <span>{getValue() as string}</span>
        },

        {
            accessorKey: "email",
            header: "Email",
            cell: ({ getValue }) => <span>{getValue() as string}</span>
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ getValue }) => <PhoneDirectionCol value={getValue() as string} />
        },

        {
            accessorKey: "roleKey",
            header: "RoleKey",
            cell: ({ getValue }) => <span>{getValue() as string}</span>
        },

        {
            accessorKey: "image",
            header: "Image",
            cell: ({ getValue }) => {
                const image = getValue() as string;
                return (
                    <div className="flex items-center justify-center w-full h-12 overflow-hidden">
                        <ImageCell cell={image} />
                    </div>
                );
            }
        },
        // {
        //     accessorKey: "Details",
        //     header: "Details",
        //     cell: ({ getValue }) => <span>{getValue() as string}</span>
        // },
        // {
        //     accessorKey: "DeliveryDetails",
        //     header: "DeliveryDetails",
        //     cell: ({ getValue }) => <span>{getValue() as string}</span>
        // },
        {
            accessorKey: "createdAt",
            header: "CreatedAt",
            cell: ({ getValue }) => {
                return (
                    <DateCol date={getValue()} />
                );
            }
        },

    ];

    return columns;
}
