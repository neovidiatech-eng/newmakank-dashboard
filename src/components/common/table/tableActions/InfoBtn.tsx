import { ExpandableButton } from "@/components/ui/ExpandableButton";
import { Link, usePathname } from "@/lib/navigation";
import { useSearchParams } from "@/lib/navigation";
import { MdInfoOutline } from "react-icons/md";

export default function InfoBtn({
  onInfo,
  id
}: {
  id: string;
  onInfo: string | boolean;
}): JSX.Element {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <Link
      href={`${typeof onInfo === "string" ? `${onInfo}/${id}` : `${pathname}/${id}`}${searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`}
    >
      <ExpandableButton
        icon={<MdInfoOutline />}
        // label={t("Info")}
        variant="outline"
        className="bg-transparent hover:text-white border transition-colors duration-200"
      />
    </Link>
  );
}
