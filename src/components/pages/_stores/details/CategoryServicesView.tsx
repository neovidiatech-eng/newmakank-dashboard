import ServicesColumns from "@/pages/dashboard/services/ServicesColumns";
import TableBasic from "@/components/common/table/TableBasic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Package } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface CategoryServicesViewProps {
  storeId: string;
  category: any;
  services: any;
}

export default function CategoryServicesView({
  storeId,
  category,
  services
}: CategoryServicesViewProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-muted/30 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Package className="w-4 h-4" />
              {t("Total Services")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{services?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("Available services in this category")}
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-muted/30 hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Activity className="w-4 h-4" />
              {t("Status")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center h-9">
              <Badge
                variant="outline"
                className={`text-sm font-semibold border-2 ${
                  category?.active
                    ? "border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                    : "border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                }`}
              >
                {category?.active ? t("Active") : t("Inactive")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl overflow-hidden border bg-card shadow-sm">
        <TableBasic
          data={services?.data || []}
          columns={ServicesColumns}
          pagination={{
            total: services?.total || 0
          }}
          cardHeader={t("Services in Category")}
          tableActions={{
            onInfo: "/services",
            onEdit: `/stores/${storeId}/products`,
            onDelete: ["services"]
          }}
          isInnerTable={false}
        />
      </div>
    </div>
  );
}
