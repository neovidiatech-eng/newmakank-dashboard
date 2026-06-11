import { Breadcrumb } from "@/components/Breadcrumb";
import { usePathname } from "@/lib/navigation";

export default function CustomHeader({
  items,
  children
}: {
  children?: React.ReactNode;
  items?: (
    | undefined
    | {
        label: string;
        href?: string;
      }
  )[];
}) {
  const pathname = usePathname().split("?")[0];
  const pathSegments = pathname.split("/").filter(Boolean);
  pathSegments.shift();

  let breadcrumbItems = pathSegments
    .map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      if (segment === "cp") return;
      return {
        label: segment,
        href: index < pathSegments.length - 1 ? href : undefined
      } as { label: string; href?: string };
    })
    .filter(Boolean);

  if (items != undefined) {
    breadcrumbItems = [...breadcrumbItems, ...items];
  }

  return (
    <div className="mb-4 px-4">
      <Breadcrumb items={breadcrumbItems}>{children}</Breadcrumb>
    </div>
  );
}
