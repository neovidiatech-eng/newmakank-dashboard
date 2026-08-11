"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareQuote, Send, Loader2 } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";

interface RatingReplyDialogProps {
  ratingId: number | string;
  customerName: string;
  comment: string;
  existingReply: string | null;
  onSuccess: () => void;
}

export default function RatingReplyDialog({
  ratingId,
  customerName,
  comment,
  existingReply,
  onSuccess
}: RatingReplyDialogProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [replyText, setReplyText] = useState(existingReply || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);

    try {
      await apiClient.post(`/api/rating/${ratingId}/reply`, {
        reply: replyText
      });

      toast.success(existingReply ? t("replyUpdated") || "تم تحديث الرد بنجاح" : t("replyAdded") || "تم إضافة الرد بنجاح");
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Failed to reply to rating:", error);
      toast.error(error?.response?.data?.message || error?.message || t("failedToReply") || "فشل إرسال الرد");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {existingReply ? (
        <div className="flex flex-col gap-1.5 items-center justify-center">
          <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-border/40 max-w-[200px] truncate text-center">
            {existingReply}
          </span>
          <Button
            variant="link"
            size="xs"
            onClick={() => {
              setReplyText(existingReply);
              setIsOpen(true);
            }}
            className="text-[11px] h-auto p-0 text-primary animate-pulse"
          >
            {t("Edit Reply") || "تعديل الرد"}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setReplyText("");
            setIsOpen(true);
          }}
          className="gap-1 text-xs border-primary/20 hover:bg-primary/5 hover:text-primary transition-all rounded-xl"
        >
          <MessageSquareQuote className="h-3.5 w-3.5" />
          {t("Reply") || "رد"}
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <MessageSquareQuote className="h-5 w-5 text-primary" />
              {existingReply ? (t("Edit Reply to Rating") || "تعديل الرد على التقييم") : (t("Reply to Customer Rating") || "الرد على تقييم العميل")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t("replyDialogDescription") || "الرد الخاص بك سيظهر للعميل في تطبيق الموبايل."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Customer Rating Context */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-border/40 space-y-1">
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                {customerName}
              </p>
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                "{comment || t("No Comment") || "بدون تعليق"}"
              </p>
            </div>

            {/* Reply Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {t("Your Reply") || "اكتب ردك هنا"}
              </label>
              <Textarea
                placeholder={t("Write your reply details...") || "اكتب تفاصيل الرد..."}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                className="text-xs resize-none rounded-xl"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="text-xs"
            >
              {t("Cancel") || "إلغاء"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting || !replyText.trim()}
              className="gap-1.5 text-xs shadow-md"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              {existingReply ? (t("Update Reply") || "تعديل الرد") : (t("Send Reply") || "إرسال الرد")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
