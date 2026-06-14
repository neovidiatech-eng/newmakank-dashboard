"use client";

import { fetchHelper } from "@/api/fetch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Plus, Store, Trash2, Loader2 } from "lucide-react";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";

interface AssignedStoresManagerProps {
  customerCategoryId: number;
}

export default function AssignedStoresManager({ customerCategoryId }: AssignedStoresManagerProps) {
  const t = useTranslations();
  const router = useRouter();
  const [assignOpen, setAssignOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [storeToRemove, setStoreToRemove] = useState<number | null>(null);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Fetch assigned stores
  const { data: assignedRes, isLoading: assignedLoading, refetch: refetchAssigned } = useQuery({
    queryKey: ["customerCategories", customerCategoryId, "stores"],
    queryFn: () => fetchHelper({ endPoint: ["customerCategories", customerCategoryId, "/stores" as any] }),
  });

  // Fetch all stores for the assign dialog
  const { data: allStoresRes, isLoading: storesLoading } = useQuery({
    queryKey: ["stores", "forAssign"],
    queryFn: () => fetchHelper({ endPoint: ["stores"], params: { limit: 100 } }),
    enabled: assignOpen
  });

  const assignedStores = assignedRes?.data || [];
  const allStores = allStoresRes?.data || [];

  // Filter out already-assigned stores
  const assignedIds = new Set(assignedStores.map((s: any) => s.id));
  const availableStores = allStores.filter((s: any) => !assignedIds.has(s.id));

  const handleAssign = useCallback(async () => {
    if (!selectedStore) return;
    setIsSaving(true);

    const res = await fetchHelper({
      endPoint: ["customerCategoriesAssign"],
      method: "POST",
      body: {
        storeId: Number(selectedStore),
        customerCategoryId
      }
    });

    if (res.success) {
      toast.success(t("done"), {
        description: t("storeAssigned")
      });
      setAssignOpen(false);
      setSelectedStore("");
      refetchAssigned();
    } else {
      toast.error(t("error"), {
        description: res?.result?.message ?? res?.message ?? t("error")
      });
    }

    setIsSaving(false);
  }, [selectedStore, customerCategoryId, t, refetchAssigned]);

  const handleUnassign = useCallback(async (storeId: number) => {
    setRemovingId(storeId);
    setConfirmOpen(false);

    const res = await fetchHelper({
      endPoint: ["customerCategories", customerCategoryId, "/stores" as any, storeId],
      method: "DELETE"
    });

    if (res.success) {
      toast.success(t("done"), {
        description: t("storeUnassigned")
      });
      refetchAssigned();
    } else {
      toast.error(t("error"), {
        description: res?.result?.message ?? res?.message ?? t("error")
      });
    }

    setRemovingId(null);
    setStoreToRemove(null);
  }, [customerCategoryId, t, refetchAssigned]);

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          {t("assignedStores")}
        </CardTitle>

        {/* Assign Store Dialog */}
        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {t("assignStore")}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("assignStore")}</DialogTitle>
              <DialogDescription>{t("assignStoreToCategory")}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <Select value={selectedStore} onValueChange={setSelectedStore} disabled={storesLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectStore")} />
                </SelectTrigger>
                <SelectContent>
                  {availableStores.map((store: any) => (
                    <SelectItem key={store.id} value={String(store.id)}>
                      {store.name?.ar || store.name?.en || store.name} — #{store.id}
                    </SelectItem>
                  ))}
                  {availableStores.length === 0 && !storesLoading && (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                      {t("No results found")}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setAssignOpen(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={handleAssign} disabled={isSaving || !selectedStore}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("assignStore")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {assignedLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : assignedStores.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            {t("noAssignedStores")}
          </div>
        ) : (
          <div className="space-y-2">
            {assignedStores.map((store: any) => (
              <div
                key={store.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {store.logo && (
                    <img src={store.logo} alt="" className="w-8 h-8 rounded-md object-cover" />
                  )}
                  <div>
                    <LocaleViewColumn value={{ en: store.name?.en, ar: store.name?.ar }} />
                    <p className="text-xs text-muted-foreground">#{store.id}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  disabled={removingId === store.id}
                  onClick={() => {
                    setStoreToRemove(store.id);
                    setConfirmOpen(true);
                  }}
                >
                  {removingId === store.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Confirm Unassign Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("unassignStore")}</DialogTitle>
            <DialogDescription>{t("confirmUnassign")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => storeToRemove && handleUnassign(storeToRemove)}
            >
              {t("Confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
