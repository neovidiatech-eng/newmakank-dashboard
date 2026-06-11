import MapZoneInput from "@/components/common/Inputs/map/MapZoneInput";

interface ZonesExpandedRowProps {
  row: Record<string, unknown>;
}

export default function ZonesExpandedRow({ row }: ZonesExpandedRowProps) {
  return (
    <MapZoneInput hideActions value={row.coordinates as any} />
  );
}