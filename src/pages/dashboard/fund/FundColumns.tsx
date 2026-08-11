import { type ColumnDef } from "@tanstack/react-table";
import { PriceAmount } from "@/components/PriceAmount";
import PhoneDirectionCol from "@/components/common/table/columns/Phone.direction";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import { useTranslations } from "@/lib/i18n";

export default function Columns(): ColumnDef<Record<string, unknown>>[] {
  const t = useTranslations();

  const columns = [
  {
    accessorKey: "Customer.name",
    header: t("Customer Name") || "Customer Name",
    cell: ({ row }) => {
      const value = row.original.Customer?.name;
      return <span>{value || '-'}</span>;
    }
  },
  {
    accessorKey: "price",
    header: t("Price") || "Price",
    cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
  },
  {
    accessorKey: "Customer.phone",
    header: t("Customer Phone") || "Customer Phone",
    cell: ({ row }) => <PhoneDirectionCol value={row.original.Customer?.phone} />
  },
  {
    accessorKey: "Customer.image",
    header: t("Customer Image") || "Customer Image",
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
    header: t("Customer Email") || "Customer Email",
    cell: ({ row }) => {
      const value = row.original.Customer?.email;
      return <span>{value || '-'}</span>;
    }
  }
  ];

  return columns;
}
