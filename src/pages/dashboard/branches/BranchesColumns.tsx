'use client'
import ActiveCol from "@/components/common/table/columns/Ative.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import PhoneDirectionCol from "@/components/common/table/columns/Phone.direction";
import { type ColumnDef } from "@tanstack/react-table";

export default function BranchesColumns(): ColumnDef<Record<string, unknown>>[] {

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
      accessorKey: "phone",
      header: () => <IconHeader columnKey="Phone" />,
      cell: ({ getValue }) => <PhoneDirectionCol value={getValue() as string} />
    },
    {
      accessorKey: "address",
      header: () => <IconHeader columnKey="Address" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "isActive",
      header: () => <IconHeader columnKey="IsActive" />,
      cell: ({ getValue }) => <>{getValue()}
        <ActiveCol value={getValue() as boolean} />
      </>
    },
    {
      accessorKey: "closed",
      header: () => <IconHeader columnKey="Closed" />,
      cell: ({ row }) => {
        const schedule = (row.original as any).storeSchedule as any[];
        let closed = Boolean(row.original.closed);

        if (schedule && Array.isArray(schedule) && schedule.length > 0) {
          const now = new Date();
          const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
          const currentDay = days[now.getDay()];
          const currentHours = now.getHours().toString().padStart(2, '0');
          const currentMinutes = now.getMinutes().toString().padStart(2, '0');
          const currentTimeStr = `${currentHours}:${currentMinutes}`;
          
          const isOpen = schedule.some(s => {
            if (s.day !== currentDay) return false;
            return currentTimeStr >= s.openingTime && currentTimeStr <= s.closingTime;
          });
          closed = !isOpen;
        }
        
        return <ActiveCol value={closed} />;
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
    {
      accessorKey: "bestRated",
      header: () => <IconHeader columnKey="BestRated" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    },
    // {
    //   accessorKey: "temporarilyClosed",
    //   header: () => <IconHeader columnKey="TemporarilyClosed" />,
    //   cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    // },
    // {
    //   accessorKey: "storeSchedule",
    //   header: "StoreSchedule",
    //   cell: ({ getValue }) => <span>{getValue() as string}</span>
    // },
    // {
    //   accessorKey: "Store",
    //   header: "Store",
    //   cell: ({ getValue }) => <span>{getValue() as string}</span>
    // },
    {
      accessorKey: "isOpen",
      header: () => <IconHeader columnKey="IsOpen" />,
      cell: ({ row }) => {
        const schedule = (row.original as any).storeSchedule as any[];
        let isOpen = Boolean(row.original.isOpen); // Default fallback

        if (schedule && Array.isArray(schedule) && schedule.length > 0) {
          const now = new Date();
          const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
          const currentDay = days[now.getDay()];
          const currentHours = now.getHours().toString().padStart(2, '0');
          const currentMinutes = now.getMinutes().toString().padStart(2, '0');
          const currentTimeStr = `${currentHours}:${currentMinutes}`;
          
          isOpen = schedule.some(s => {
            if (s.day !== currentDay) return false;
            return currentTimeStr >= s.openingTime && currentTimeStr <= s.closingTime;
          });
        }
        
        return <ActiveCol value={isOpen} />;
      }
    }
  ];

  return columns;
}
