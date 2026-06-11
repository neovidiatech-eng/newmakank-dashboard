import { TableHeaders } from "@/components/common/table/table.types";

export const extractTableHeadersFromRes = (data: any[]): TableHeaders[] => {
  if (!data || !data?.length) {
    return [];
  }
  return Object.keys(data[0])
    .filter(
      key =>
        typeof data[0][key as keyof string] === "string" ||
        typeof data[0][key as keyof number] === "number"
    )
    .filter(item => {
      if (item === "id") return true;
      return !item.toLowerCase().includes("id");
    })
    .map(key => ({ name: key }));
};
