'use client'
import ActiveCol from "@/components/common/table/columns/Ative.column";
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";

export default function SocialMediaColumns(): ColumnDef<Record<string, unknown>>[] {

  const columns = [
    {
      accessorKey: "id",
      header: () => <IconHeader columnKey="Id" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "platform",
      header: () => <IconHeader columnKey="Platform" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "link",
      header: () => <IconHeader columnKey="Link" />,
      cell: ({ getValue }) => {
        const link = getValue() as string;
        if (!link) return <span className="text-gray-400">No link</span>;

        return (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2"
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="truncate max-w-[200px]">
                {link.replace(/^https?:\/\//, "")}
              </span>
            </a>
          </Button>
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
    {
      accessorKey: "isActive",
      header: () => <IconHeader columnKey="IsActive" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    },
    {
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => {
        return (
          <DateCol date={getValue()} />
        );
      }
    }
  ];

  return columns;
}
