import DateCol from "@/components/common/table/columns/date.column";
import EntityInfoCell from "@/components/common/table/columns/entity-info-cell";
import IconHeader from "@/components/common/table/columns/icon-header";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import BtnAction from "@/components/common/table/tableActions/btn-action";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import { type ColumnDef } from "@tanstack/react-table";
import { Ban, CheckCircle } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { StoreStatusSelect } from "@/components/pages/_stores/StoreStatusSelect";
import { StoreApprovalAction } from "@/components/pages/_stores/StoreApprovalAction";

export default function StoresColumns(): ColumnDef<Record<string, unknown>>[] {
  const t = useTranslations();
  const columns = [
    {
      id: "storeInfo",
      header: () => <IconHeader columnKey="Store" />,
      cell: ({ row }) => (
        <EntityInfoCell
          image={row.original.logo as string | null | undefined}
          name={row.original.name?.en as string | null | undefined}
          email={row.original.name?.ar as string | null | undefined}
        />
      )
    },
    {
      accessorKey: "cover",
      header: () => <IconHeader columnKey="Cover" />,
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
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => {
        return <DateCol date={getValue()} />;
      }
    },
    {
      accessorKey: "status",
      header: () => <IconHeader columnKey="status" />,
      cell: ({ row }) => {
        const storeId = row.original.id as string;
        const status = row.original.status as string;
        return <StoreStatusSelect storeId={storeId} initialStatus={status} />;
      }
    },
    // {
    //   accessorKey: "freeDelivery",
    //   header: () => <IconHeader columnKey="FreeDelivery" />,
    //   cell: ({ getValue }) => <TableStatusBadge status={getValue()} />
    // },
    {
      accessorKey: "isVerified",
      header: () => <IconHeader columnKey="IsVerified" />,
      cell: ({ getValue }) => <TableStatusBadge status={getValue()} />
    },
    {
      accessorKey: "isStoreAccepted",
      header: () => <IconHeader columnKey="isStoreAccepted" />,
      cell: ({ row }) => {
        const isAccepted = row.original.isStoreAccepted as boolean;
        if (isAccepted) return <TableStatusBadge status="true" />;
        return <StoreApprovalAction storeId={row.original.id as number} />;
      }
    },
    {
      accessorKey: "rating",
      header: () => <IconHeader columnKey="Rating" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "review",
      header: () => <IconHeader columnKey="Review" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    // {
    //   accessorKey: "closed",
    //   header: () => <IconHeader columnKey="Closed" />,
    //   cell: ({ getValue }) => <TableStatusBadge status={getValue()} />
    // },
    // {
    //   accessorKey: "temporarilyClosed",
    //   header: () => <IconHeader columnKey="TemporarilyClosed" />,
    //   cell: ({ getValue }) => <TableStatusBadge status={getValue()} />
    // },
    // {
    //   accessorKey: "subCategory",
    //   header: () => <IconHeader columnKey="subCategory" />,
    //   cell: ({ row }) => (
    //     <TooltipProvider>
    //       <Tooltip>
    //         <TooltipTrigger asChild>
    //           <Link
    //             href={`/stores/${row.original.id}/categories`}
    //             className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    //           >
    //             <BiCategory className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    //           </Link>
    //         </TooltipTrigger>
    //         <TooltipContent>
    //           <p>{t("View Categories")}</p>
    //         </TooltipContent>
    //       </Tooltip>
    //     </TooltipProvider>
    //   )
    // },
    {
      id: "block",
      header: () => <IconHeader columnKey="Block" />,
      cell: ({ row }) => {
        const storeId = row.original.id as string;
        const isBlocked = row.original.isBlocked as boolean;
        return (
          <BtnAction variant={isBlocked ? "destructive" : "default"} endpoint={["stores", Number(storeId), "block"]} method="PATCH">
            {isBlocked ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                {t("Unblock")}
              </>
            ) : (
              <>
                <Ban className="h-4 w-4 mr-1" />
                {t("Block")}
              </>
            )}
          </BtnAction>
        );
      }
    }
  ];

  return columns;
}
