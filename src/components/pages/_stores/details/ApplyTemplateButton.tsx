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
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ApplyTemplateButtonProps {
  storeId: number;
}

export function ApplyTemplateButton({ storeId }: ApplyTemplateButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch templates when modal opens
  const { data: templatesRes, isLoading } = useQuery({
    queryKey: ["storeTemplates"],
    queryFn: () => fetchHelper({ endPoint: ["storeTemplates"] }),
    enabled: open
  });

  const handleSave = async () => {
    if (!selectedTemplate) return;
    setIsSaving(true);

    const res = await fetchHelper({
      endPoint: ["stores", storeId, "applyTemplate"],
      method: "POST",
      body: {
        templateId: Number(selectedTemplate)
      }
    });

    if (res.success) {
      toast.success(t("done"), {
        description: t("templateApplied")
      });
      setOpen(false);
      router.refresh();
    } else {
      toast.error(t("error"), {
        description: res?.result?.message ?? t("error")
      });
    }

    setIsSaving(false);
  };

  const templates = templatesRes?.data || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("applyTemplate")}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("applyTemplate")}</DialogTitle>
          <DialogDescription>{t("applyTemplateDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectTemplate")} />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template: any) => (
                <SelectItem key={template.id} value={String(template.id)}>
                  {template.name?.ar || template.name?.en || template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !selectedTemplate}>
            {t("apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
