import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ComplaintFormPageProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};

export default function ComplaintFormPage({ data }: ComplaintFormPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data ? "Edit Complaint" : "Create Complaint"}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Complaint form configuration has not been implemented yet.
        </p>
      </CardContent>
    </Card>
  );
}
