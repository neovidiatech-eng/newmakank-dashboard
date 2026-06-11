'use client'
import { PriceAmount } from "@/components/PriceAmount";
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import TextCol from "@/components/common/table/columns/text.column";
import { type ColumnDef } from "@tanstack/react-table";

export default function CouponsColumns(): ColumnDef<Record<string, unknown>>[] {
  const columns = [
    {
      accessorKey: "title",
      header: () => <IconHeader key="title" columnKey="title" />,
      cell: ({ row }) => {
        const en = row.original.title?.en as string;
        const ar = row.original.title?.ar as string;
        return (
          <LocaleViewColumn value={{ en, ar }} />
        );
      }
    },
    {
      accessorKey: "code",
      header: () => <IconHeader columnKey="code" />,
      cell: ({ getValue }) => <TextCol text={getValue() as string} />
    },
    {
      accessorKey: "type",
      header: () => <IconHeader columnKey="type" />,
      cell: ({ getValue }) => <TextCol text={getValue() as string} />
    },
    {
      accessorKey: "discountType",
      header: () => <IconHeader columnKey="discountType" />,
      cell: ({ getValue }) => <TextCol text={getValue() as string} />
    },
    {
      accessorKey: "discountValue",
      header: () => <IconHeader columnKey="discountValue" />,
      cell: ({ getValue }) => <TextCol text={getValue() as string} />
    },
    {
      accessorKey: "maxUsage",
      header: () => <IconHeader columnKey="maxUsage" />,
      cell: ({ getValue }) => <TextCol text={getValue() as string} />
    },
    {
      accessorKey: "usageCount",
      header: () => <IconHeader columnKey="usageCount" />,
      cell: ({ getValue }) => <TextCol text={getValue() as string} />
    },
    {
      accessorKey: "minOrderAmount",
      header: () => <IconHeader columnKey="minOrderAmount" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "startDate",
      header: () => <IconHeader columnKey="startDate" />,
      cell: ({ getValue }) => <DateCol date={getValue()} />
    },
    {
      accessorKey: "endDate",
      header: () => <IconHeader columnKey="endDate" />,
      cell: ({ getValue }) => <DateCol date={getValue()} />
    },
    {
      accessorKey: "minDiscountValue",
      header: () => <IconHeader columnKey="minDiscountValue" />,
      cell: ({ getValue }) => <TextCol text={getValue() as string} />
    },
    {
      accessorKey: "maxDiscountValue",
      header: () => <IconHeader columnKey="maxDiscountValue" />,
      cell: ({ getValue }) => <TextCol text={getValue() as string} />
    },
    {
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="createdAt" />,
      cell: ({ getValue }) => <DateCol date={getValue()} />
    }
  ];

  return columns;
}
