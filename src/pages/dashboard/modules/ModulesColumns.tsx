import ActiveCol from "@/components/common/table/columns/Ative.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import { type ColumnDef } from "@tanstack/react-table";

export default function CitiesColumns(): ColumnDef<Record<string, unknown>>[] {
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
      accessorKey: "description",
      header: () => <IconHeader columnKey="Description" />,
      cell: ({ row }) => {
        const en = row.original.description?.en as string;
        const ar = row.original.description?.ar as string;
        return (
          <LocaleViewColumn value={{ en, ar }} />
        );
      }
    },
    {
      accessorKey: "image",
      header: () => <IconHeader columnKey="Image" />,
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
    //   accessorKey: "color",
    //   header: () => <IconHeader columnKey="Color" />,
    //   cell: ({ getValue }) => <ColorCol value={getValue() as string} />
    // },
    {
      accessorKey: "active",
      header: () => <IconHeader columnKey="Active" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    },
    {
      accessorKey: "order",
      header: () => <IconHeader columnKey="sorting Order" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    // {
    //   accessorKey: "type",
    //   header: () => <IconHeader columnKey="Type" />,
    //   cell: ({ getValue }) => <span>{getValue() as string}</span>
    // },
    // {
    //   accessorKey: "createdAt",
    //   header: () => <IconHeader columnKey="CreatedAt" />,
    //   cell: ({ getValue }) => {
    //     return <DateCol date={getValue()} />;
    //   }
    // }
  ];

  return columns;
}
