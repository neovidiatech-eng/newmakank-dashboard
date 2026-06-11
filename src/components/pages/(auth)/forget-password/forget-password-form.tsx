import { fetchHelper } from "@/api/fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";
import AuthRules from "../login/auth-roles";

type Step = "request" | "validate-otp" | "reset";

export default function ResetPasswordForm({ roles }: { roles?: Roles[] }) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [tempToken, setTempToken] = useState("");
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetchHelper({
        endPoint: ['forgetPassword'],
        method: "POST",
        body: { email }
      });
      if (res.success) {
        toast.success(t("OTP sent to your email"), {});
        setCurrentStep("validate-otp");
        setTempToken(res.data?.token || "");
      } else {
        toast.error(t(res.message), {});
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.toString() : "Unknown error";

      toast(t("Something went wrong") + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleValidateOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetchHelper({
        endPoint: ['verifyResetPassword'],
        method: "POST",
        body: { otp },
        headers: {
          Authorization: `Bearer ${tempToken}`
        }
      });
      if (res.success) {
        setTempToken(res.data?.token || "");
        toast.success(t("OTP validated successfully"), {});
        setCurrentStep("reset");
      } else {
        toast.error(t(res.message), {});
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.toString() : "Unknown error";

      toast.error(t("Something went wrong") + errorMessage, {});
    } finally {
      setIsLoading(false);
    }
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error(t("Passwords do not match"));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetchHelper({
        endPoint: ['resetPassword'],
        method: "POST",
        body: { password },
        headers: {
          Authorization: `Bearer ${tempToken}`
        }
      });

      if (res.success) {
        toast.success(t("Password reset successfully"));
        router.push("/signin");
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
  const handleResendOTP = async () => {
    if (!email) return;
    setIsLoading(true);

    try {
      const res = await fetchHelper({
        endPoint: ['forgetPassword'],
        method: "POST",
        body: { email }
      });

      if (res.success) {
        toast.success(t("OTP resent to your email"));
        setTempToken(res.data?.token || "");
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
    <Card className="container  shadow-lg">
      {roles && <AuthRules data={roles} />}

      <div className="grid sm:grid-cols-2 gap-4 my-6 px-6 pt-4"></div>

      <CardHeader className="mb-6 space-y-2">
        <CardTitle className="text-2xl text-center">{t("Reset Password")}</CardTitle>
        <CardDescription className="text-center">
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
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  router.back();
                }}
                className="w-full"
              >
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
            {" "}
            <div className="grid gap-2">
              <Label htmlFor="otp">{t("OTP")}</Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-primary justify-self-end hover:underline"
              >
                {t("Resend OTP")}
              </button>
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
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">{t("Confirm Password")}</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
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
