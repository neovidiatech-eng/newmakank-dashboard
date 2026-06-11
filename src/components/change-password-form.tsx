import { fetchHelper } from "@/api/fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = e.target as HTMLFormElement;
    const currentPassword = formData.currentPassword.value;
    const newPassword = formData.newPassword.value;
    const confirmPassword = formData.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      toast.error(t("New passwords do not match"));
      setIsLoading(false);
      return;
    }

    await fetchHelper({
      endPoint: ['changePassword'],
      method: "PATCH",
      body: {
        password: currentPassword,
        newPassword
      }
    }).then((res: ApiResponse<unknown>) => {
      setIsLoading(false);

      if (!res.success) {
        toast.error(res.result?.message ?? res.message);
      } else {
        toast.success(t("Password changed successfully"));
        formData.reset();
      }
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Card className="mx-auto border-0 max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("Change Password")}</CardTitle>
          <CardDescription className="mb-3">{t("Update your account password")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid mt-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">{t("Current Password")}</Label>
              <Input id="currentPassword" type="password" required minLength={6} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">{t("New Password")}</Label>
              <Input id="newPassword" type="password" required minLength={6} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">{t("Confirm New Password")}</Label>
              <Input id="confirmPassword" type="password" required minLength={6} />
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-success text-success-foreground hover:bg-success/90 active:bg-success/80 border border-success px-3 py-1 rounded"
            >
              {isLoading ? t("Changing Password") : t("Change Password")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
