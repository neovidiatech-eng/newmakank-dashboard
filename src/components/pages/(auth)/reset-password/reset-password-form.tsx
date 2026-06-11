import { fetchHelper } from "@/api/fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";

type Step = "request" | "validate-otp" | "reset";

export default function ResetPasswordForm(): JSX.Element {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [tempToken, setTempToken] = useState("");
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetchHelper({
        endPoint: ["resetAdminPassword"],
        method: "POST",
        body: { email }
      });

      if (res.success) {
        toast.success(t("OTP sent to your email"));
        setCurrentStep("validate-otp");
      } else {
        toast.error(t(res.message));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.toString() : "Unknown error";

      toast.error(t("Something went wrong") + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const otp = formData.get("otp") as string;

    try {
      const res = await fetchHelper({
        endPoint: ["verifyResetPassword"],
        method: "POST",
        body: { email, code: otp }
      });
      if (res.success) {
        setTempToken(res.data?.token);
        toast.success(t("OTP validated successfully"));
        setCurrentStep("reset");
      } else {
        toast.error(t(res.message));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.toString() : "Unknown error";
      toast.error(t("Something went wrong") + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error(t("Passwords do not match"));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetchHelper({
        endPoint: ["resetAdminPassword"],
        method: "POST",
        body: { email, password, token: tempToken }
      });

      if (res.success) {
        toast.success(t("Password reset successfully"));
        // onClose();
      } else {
        toast.error(t(res.message));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.toString() : "Unknown error";

      toast.error(t("Something went wrong") + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("Reset Password")}</CardTitle>
        <CardDescription>
          {currentStep === "request" && t("Enter your email to reset password")}
          {currentStep === "validate-otp" && t("Enter the OTP sent to your email")}
          {currentStep === "reset" && t("Enter your new password")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentStep === "request" && (
          <form onSubmit={handleRequestReset} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("Email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => { }} className="w-full">
                {t("Cancel")}
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full">
                {t("Send OTP")}
              </Button>
            </div>
          </form>
        )}

        {currentStep === "validate-otp" && (
          <form onSubmit={handleValidateOTP} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="otp">{t("OTP")}</Label>
              <Input id="otp" name="otp" type="text" required />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep("request")}
                className="w-full"
              >
                {t("Back")}
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full">
                {t("Verify OTP")}
              </Button>
            </div>
          </form>
        )}

        {currentStep === "reset" && (
          <form onSubmit={handleResetPassword} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">{t("New Password")}</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">{t("Confirm Password")}</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep("validate-otp")}
                className="w-full"
              >
                {t("Back")}
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full">
                {t("Reset Password")}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
