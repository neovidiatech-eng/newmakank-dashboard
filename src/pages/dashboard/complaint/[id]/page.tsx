import { fetchData } from "@/api/global/fetchData";
import ComplaintReplyChat, {
  type ComplaintReply
} from "@/components/common/complaint/ComplaintReplyChat";
import DateCol from "@/components/common/table/columns/date.column";
import { PriceAmount } from "@/components/PriceAmount";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "@/lib/i18n";
import React from "react";

interface ComplaintUser {
  id: number;
  name: string;
  phone: string;
}

interface ComplaintOrder {
  id: number;
  status: string;
  totalPriceAfterDiscount: number;
}

interface ComplaintData {
  id: number;
  userId: number;
  orderId: number;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  User?: ComplaintUser;
  Order?: ComplaintOrder;
  Replies?: ComplaintReply[] | ComplaintReply;
}

const DetailRow = ({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}): JSX.Element => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
    <div className="text-sm font-semibold text-right">{children}</div>
  </div>
);

async function page({ params }: { params: Params }): Promise<JSX.Element> {
  const t = await getTranslations();
  const id = Number((await params).id);
  const response = await fetchData(["complaint", id]);
  const complaint = response?.data as ComplaintData | undefined;

  if (!complaint)
    return <div className="p-8 text-center text-muted-foreground">{t("No Data Available")}</div>;

  return (
    <div className="container mx-auto max-w-5xl space-y-8 py-8">
      <Card className="border-muted/60 bg-muted/20">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {t("Complaint Details")} #{complaint.id}
            </h1>
            <div className="mt-1 text-sm text-muted-foreground">
              {t("Created At")} <DateCol date={complaint.createdAt} />
            </div>
          </div>
          {complaint.status && (
            <Badge variant="outline" className="text-xs capitalize">
              {complaint.status}
            </Badge>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Complaint Details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label={t("ID")}>{complaint.id}</DetailRow>
            <DetailRow label={t("userId")}>{complaint.userId}</DetailRow>
            <DetailRow label={t("Order")}>{complaint.orderId}</DetailRow>
            <DetailRow label={t("Status")}>{complaint.status}</DetailRow>
            <Separator />
            <DetailRow label={t("createdAt")}>
              <DateCol date={complaint.createdAt} />
            </DetailRow>
            <DetailRow label={t("updatedAt")}>
              <DateCol date={complaint.updatedAt} />
            </DetailRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("User Details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label={t("ID")}>{complaint.User?.id ?? "-"}</DetailRow>
            <DetailRow label={t("User")}>{complaint.User?.name ?? "-"}</DetailRow>
            <DetailRow label={t("Phone")}>{complaint.User?.phone ?? "-"}</DetailRow>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("Order Details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label={t("ID")}>{complaint.Order?.id ?? "-"}</DetailRow>
            <DetailRow label={t("Status")}>{complaint.Order?.status ?? "-"}</DetailRow>
            <DetailRow label={t("Total")}>
              {complaint.Order ? (
                <PriceAmount value={complaint.Order.totalPriceAfterDiscount} />
              ) : (
                "-"
              )}
            </DetailRow>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 border-muted/60 bg-muted/20">
          <CardHeader>
            <CardTitle>{t("reason")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {complaint.reason}
            </p>
          </CardContent>
        </Card>
      </div>

      <ComplaintReplyChat
        endpoint={["complaint", complaint.id, "reply"]}
        replies={complaint.Replies}
      />
    </div>
  );
}

export default page;
