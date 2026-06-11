import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2 } from "lucide-react";
import { ApiResponseCustomer } from "@/pages/dashboard/orders/types";

interface OrderCustomerCellProps {
  customer: ApiResponseCustomer;
}

export function OrderCustomerCell({ customer }: OrderCustomerCellProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8 border border-border/50">
        <AvatarImage src={customer?.image} alt={customer?.name} />
        <AvatarFallback className="bg-primary/5 text-[10px]">
          <User2 className="h-3 w-3 opacity-50" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium truncate leading-none mb-1">
          {customer?.name || "-"}
        </span>
        <span className="text-[10px] font-mono opacity-50 truncate leading-none">
          {customer?.phone || "-"}
        </span>
      </div>
    </div>
  );
}
