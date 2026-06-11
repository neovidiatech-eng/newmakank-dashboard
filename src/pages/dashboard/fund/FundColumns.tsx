'use client'
import { type ColumnDef } from "@tanstack/react-table";
import { PriceAmount } from "@/components/PriceAmount";
import PhoneDirectionCol from "@/components/common/table/columns/Phone.direction";
import { ImageCell } from "@/components/common/table/columns/img-cell";

export default function Columns(): ColumnDef<Record<string, unknown>>[] {

  const columns = [
  {
    accessorKey: "Customer.name",
    header: "Customer Name",
    cell: ({ row }) => {
      const value = row.original.Customer?.name;
      return <span>{value || '-'}</span>;
    }
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
  },
  {
    accessorKey: "Customer.phone",
    header: "Customer Phone",
    cell: ({ row }) => <PhoneDirectionCol value={row.original.Customer?.phone} />
  },
  {
    accessorKey: "Customer.image",
    header: "Customer Image",
    cell: ({ row }) => {
      const image = row.original.Customer?.image;
      return (
        <div className="flex items-center justify-center w-full h-12 overflow-hidden">
          <ImageCell cell={image} />
        </div>
      );
    }
  },
  {
    accessorKey: "Customer.email",
    header: "Customer Email",
    cell: ({ row }) => {
      const value = row.original.Customer?.email;
      return <span>{value || '-'}</span>;
    }
  }
  ];

  return columns;
}
