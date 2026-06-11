import { fetchHelper } from "@/api/fetch";
import { revalidatePathAction } from "@/api/global/revalidatePath";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RealizeOrderButton({ orderId }: { orderId: number }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleRealize = async () => {
    try {
      setIsLoading(true);
      const response = await fetchHelper({
        endPoint: ["ordersArchived", orderId, "realize"],
        method: "POST",
        body: {}
      });

      if (!response?.success) {
        throw response;
      }

      toast.success(response?.message || t("Order realized successfully"));
      await revalidatePathAction(pathname);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.result?.message || error?.message || t("Failed to realize order"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRealize}
      isLoading={isLoading}
      title={t("Realize")}
    >
      <RefreshCcw className="h-4 w-4 mr-2" />
      {t("Realize")}
    </Button>
  );
}
