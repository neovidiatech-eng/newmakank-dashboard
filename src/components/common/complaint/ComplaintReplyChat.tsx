"use client";

import DateCol from "@/components/common/table/columns/date.column";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/utils/FormActions";
import type { endpointType } from "@/utils/endpoints";
import { useTranslations } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export interface ComplaintReply {
  id?: number;
  message?: string;
  createdAt?: string;
  User?: {
    id?: number;
    name?: string;
  };
  orderBy?: {
    createdAt?: string;
  };
}

interface ComplaintReplyChatProps {
  endpoint: endpointType;
  replies?: ComplaintReply[] | ComplaintReply | null;
}

interface ReplyFormValues {
  message: string;
}

export default function ComplaintReplyChat({
  endpoint,
  replies
}: ComplaintReplyChatProps): JSX.Element {
  const t = useTranslations();
  const formAction = useFormAction();
  const normalizedReplies = useMemo(
    () => (Array.isArray(replies) ? replies : replies ? [replies] : []),
    [replies]
  );
  const [localReplies, setLocalReplies] = useState<ComplaintReply[]>(normalizedReplies);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ReplyFormValues>({
    defaultValues: {
      message: ""
    }
  });

  useEffect(() => {
    setLocalReplies(normalizedReplies);
  }, [normalizedReplies]);

  const getInitials = (name?: string) => {
    if (!name) return t("User").slice(0, 1).toUpperCase();
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join("");
  };

  const onSubmit = async (formData: ReplyFormValues) => {
    const response = await formAction({
      formData,
      endpoint,
      method: "POST",
      customReset: () => reset(),
      t
    });

    if (response?.success) {
      setLocalReplies(prev => [
        ...prev,
        {
          id: response?.data?.id ?? Date.now(),
          message: formData.message,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Replies")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {localReplies.length > 0 ? (
          <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
            {localReplies.map(reply => (
              <div
                key={`${reply.id}-${reply.createdAt}`}
                className="rounded-xl border bg-background p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {getInitials(reply.User?.name)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {reply.User?.name ?? t("User")}
                      </div>
                      {reply.orderBy?.createdAt && (
                        <div className="text-xs text-muted-foreground">
                          {t("Order Details")}: <DateCol date={reply.orderBy.createdAt} />
                        </div>
                      )}
                    </div>
                  </div>
                  {reply.createdAt && (
                    <div className="text-xs text-muted-foreground">
                      <DateCol date={reply.createdAt} />
                    </div>
                  )}
                </div>
                <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">
                  {reply.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t("No Replies Yet")}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-xl border p-4">
          <div className="space-y-2">
            <Textarea
              placeholder={t("Message")}
              rows={4}
              {...register("message", {
                required: t("Message is required")
              })}
            />
            {errors.message?.message && <ErrorMessage error={errors.message.message} />}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {t("Send Reply")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
