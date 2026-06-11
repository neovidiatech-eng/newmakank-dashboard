import TableStatusBadge from "../tableHelperComponents/TableStatusBadge";

export default function StatusCol({
  value
}: {
  value: string;

}) {
  return <TableStatusBadge status={value} />;
}
