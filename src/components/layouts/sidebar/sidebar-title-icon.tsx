import { cn } from "../../../lib/utils";
import { mainIcons } from "../../../utils/icons";

export default function SidebarTitleIcon({
  item,
  isParentActive
}: {
  isParentActive?: boolean;
  item: NavItem;
}) {
  // Determine which icon to use
  const iconKey = (item.icon || item.title) as keyof typeof mainIcons;
  const IconComponent =
    typeof iconKey === "string" && iconKey in mainIcons ? mainIcons[iconKey] : null;

  return (
    <span
      style={{
        filter: "invert(var(--base))"
      }}
      className={cn(``, isParentActive ? "text-primary font-bold" : " text-primary")}
    >
      {IconComponent && <IconComponent size={20} />}{" "}
    </span>
  );
}
