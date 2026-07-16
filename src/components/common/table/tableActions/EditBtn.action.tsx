import { ExpandableButton } from "@/components/ui/ExpandableButton";
import { Link, usePathname } from "@/lib/navigation";
import { useSearchParams } from "@/lib/navigation";
import { MdEdit } from "react-icons/md";

export default function EditBtn({ onEdit, id }: { id: string; onEdit: string }): JSX.Element {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Link
      data-testid="table-edit-btn"
      href={(() => {
        const searchParamsString = searchParams.toString();
        const searchParamsSuffix = searchParamsString ? `?${searchParamsString}` : "";
        if (typeof onEdit === "string") {
          const [basePath, query] = onEdit.split("?");
          const combinedParams = new URLSearchParams(query || "");
          searchParams.forEach((value, key) => {
            combinedParams.set(key, value);
          });
          const suffix = combinedParams.toString() ? `?${combinedParams.toString()}` : "";
          return `${basePath}/${id}/edit${suffix}`;
        }
        return `${pathname}/${id}/edit${searchParamsSuffix}`;
      })()}
    >
      <ExpandableButton
        icon={<MdEdit />}
        variant="outline"
        className="bg-transparent text-primary hover:text-white hover:bg-primary border transition-colors duration-200"
      />
    </Link>
  );
}
