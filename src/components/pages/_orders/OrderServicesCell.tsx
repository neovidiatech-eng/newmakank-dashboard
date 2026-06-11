import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "@/lib/i18n";
import { ApiResponseOrderItemsItem } from "@/pages/dashboard/orders/types";

interface OrderServicesCellProps {
  items: ApiResponseOrderItemsItem[];
}

export function OrderServicesCell({ items }: OrderServicesCellProps) {
  const t = useTranslations();

  if (!items || items.length === 0) return <span>-</span>;

  const displayItems = items.slice(0, 2);
  const remainingCount = items.length - displayItems.length;

  return (
    <div className="flex flex-wrap gap-1.5 max-w-[250px]">
      {displayItems.map((item, index) => (
        <Badge
          key={index}
          variant="outline"
          className="whitespace-nowrap bg-background/50 hover:bg-accent transition-all duration-200"
        >
          <span className="truncate max-w-[120px]">
            {item.Service?.name?.en || item.Service?.name?.ar}
          </span>
          <span className="ml-1 text-[10px] opacity-70 font-mono">x{item.quantity}</span>
        </Badge>
      ))}
      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className="cursor-help bg-secondary/50 hover:bg-secondary transition-colors"
              >
                +{remainingCount} {t("more")}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px] p-3 space-y-2 bg-popover text-popover-foreground border shadow-xl">
              <p className="font-semibold text-xs border-b pb-1 mb-1 opacity-70">
                {t("Additional Items")}
              </p>
              <div className="flex flex-col gap-1.5">
                {items.slice(2).map((item, index) => (
                  <div key={index} className="flex justify-between items-center gap-4 text-xs">
                    <span className="truncate">
                      {item.Service?.name?.en || item.Service?.name?.ar}
                    </span>
                    <span className="font-mono opacity-70">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
