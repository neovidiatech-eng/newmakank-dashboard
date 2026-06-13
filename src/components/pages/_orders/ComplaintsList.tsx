import type { ApiResponseComplaintsItem } from "@/pages/dashboard/orders/types";
import DateCol from "@/components/common/table/columns/date.column";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

export default function ComplaintsList({
    complaints,
}: {
    complaints: ApiResponseComplaintsItem[];
}) {
    const t = useTranslations();

    if (!complaints || complaints.length === 0)
        return (
            <div className="text-muted-foreground text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {t("No Complaints")}
            </div>
        );

    return (
        <div className="space-y-3">
            {complaints.map((complaint) => (
                <div key={complaint.id} className="border rounded p-3 space-y-1 text-sm">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground text-xs">
                            #{complaint.id} &mdash; <DateCol date={complaint.createdAt} />
                        </span>
                        <Badge variant="outline">{complaint.status}</Badge>
                    </div>
                    <p>{complaint.description}</p>
                </div>
            ))}
        </div>
    );
}
