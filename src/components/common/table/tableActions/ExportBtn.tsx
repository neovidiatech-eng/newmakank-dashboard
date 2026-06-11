// "use client";

// import { Button } from "@/components/ui/button";
// import { DownloadCloud } from "lucide-react";
// import { FaFileCsv } from "react-icons/fa";

// export default function ExportBtn({}: {
//   exportName?: string;
//   headers: { name: string }[];
//   data: Record<string, unknown>[];
//   hideId?: boolean;
// }): JSX.Element {
//   // const t = useTranslations();

//   // const getValueFromReactElement = (value: React.ReactNode): string => {
//   //   if (React.isValidElement(value)) {
//   //     if (value?.props?.children) {
//   //       if (Array.isArray(value.props.children)) {
//   //         return value.props.children
//   //           .map((child: React.ReactNode) =>
//   //             React.isValidElement(child) ? getValueFromReactElement(child) : String(child)
//   //           )
//   //           .join("");
//   //       }
//   //       return getValueFromReactElement(value.props.children);
//   //     }
//   //     return "";
//   //   }
//   //   return String(value ?? "");
//   // };

//   // const exportToCSV = useCallback(() => {
//   //   const csvHeaders = headers
//   //     .filter((_, index) => !(index === 0 && hideId))
//   //     .map(header => t(header))
//   //     .join(",");

//   //   const csvRows = data?.map(row =>
//   //     headers
//   //       .filter((_, index) => !(index === 0 && hideId))
//   //       .map(header => {
//   //         const value = getValueFromReactElement(row[header.name] as string);
//   //         return `"${value.replace(/"/g, '""')}"`;
//   //       })
//   //       .join(",")
//   //   );

//   //   const csvContent = `\uFEFF${csvHeaders}\n${csvRows.join("\n")}`;
//   //   saveAs(
//   //     new Blob([csvContent], { type: "text/csv;charset=utf-8" }),
//   //     `${exportName ?? "export"}.csv`
//   //   );
//   // }, [headers, data, hideId, getValueFromReactElement]);

//   return (
//     <Button onClick={() => {}} variant="outline" size="sm">
//       {/* <Button onClick={exportToCSV} variant="outline" size="sm"> */}
//       <FaFileCsv className="h-4 w-4 " />
//       <DownloadCloud className="h-4 w-4 " />
//     </Button>
//   );
// }
