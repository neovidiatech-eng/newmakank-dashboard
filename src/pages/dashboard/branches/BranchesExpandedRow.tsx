import MapPointerInput from "@/components/common/Inputs/map/MapPointerInput";

interface BranchesExpandedRowProps {
    row: Record<string, unknown>;
}

export default function BranchesExpandedRow({ row }: BranchesExpandedRowProps) {
    return (
        <MapPointerInput
            hideActions
            value={{
                lat: row.lat as number,
                lng: row.lng as number,
            } as any}
        />
    );
}