import ActiveCol from "@/components/common/table/columns/Ative.column";
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import { type ColumnDef } from "@tanstack/react-table";
import { useApiQuery } from "@/hooks/useApiQuery";

function CityCell({ row }: { row: any }) {
  const cityObj = row.original.City || row.original.city;
  const initialCityName = cityObj?.name?.ar || cityObj?.name?.en;
  
  const { data: response } = useApiQuery({
    queryKey: ["cities-zones"],
    endPoint: ["cities"],
    params: { limit: 1000 },
    enabled: !initialCityName && !!row.original.cityId
  });

  if (initialCityName) {
    return <span>{initialCityName}</span>;
  }

  const citiesList = response?.data?.data || response?.data || [];
  const city = Array.isArray(citiesList) ? citiesList.find((c: any) => Number(c.id) === Number(row.original.cityId)) : null;
  const fetchedName = city?.name?.ar || city?.name?.en;

  return <span>{fetchedName || row.original.cityId || "-"}</span>;
}

export default function ZonesColumns(): ColumnDef<Record<string, unknown>>[] {
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
      accessorKey: "cityId",
      header: () => <IconHeader columnKey="City" />,
      cell: ({ row }) => <CityCell row={row} />
    },
    {
      accessorKey: "deliveryPrice",
      header: () => <IconHeader columnKey="Delivery Price" />,
      cell: ({ getValue }) => {
        const val = getValue() as number | undefined;
        return <span>{val !== undefined && val !== null ? `${val} EGP` : "-"}</span>;
      }
    },
    // {
    //   accessorKey: "coordinates",
    //   header: "Coordinates",
    //   cell: ({ getValue }) => <span>{getValue() as string}</span>
    // },
    {
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => {
        return <DateCol date={getValue()} />;
      }
    },
    {
      accessorKey: "active",
      header: () => <IconHeader columnKey="Active" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    }
  ];

  return columns;
}
