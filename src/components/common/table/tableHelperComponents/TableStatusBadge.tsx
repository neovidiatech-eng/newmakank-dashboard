import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/lib/i18n";

function TableStatusBadge({ status }: { status: string }) {
  const t = useTranslations();
  let variant: "default" | "destructive" | "secondary" | "outline" | "success" = "default";
  switch (status?.toString()) {
    case "APPROVED":
    case "ACCEPTED":
    case "RESOLVED":
    case "get":
    case "PAID":
    case "DELIVERED":
    case "VISA":
    case "true":
      variant = "success";
      break;
    case "CASH":
    case "IN_PROGRESS":
      variant = "outline";
      break;
    case "REJECTED":
    case "delete":
    case "CANCELLED":
    case "UNPAID":
    case "false":
    case "DENIED":
      variant = "destructive";
      break;
    case "PENDING":
    case "post":
    case "patch":
      variant = "secondary";
      break;
  }
  return (
    <Badge variant={variant}>
      <p className="text-sm text-nowrap font-normal">{t(status?.toString())}</p>
    </Badge>
  );
}

export default TableStatusBadge;
