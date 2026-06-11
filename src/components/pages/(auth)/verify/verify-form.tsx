import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyForm } from "@/features/auth/verify/hooks/use-verify-form";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import Link from "@/lib/Link";
import { useLocale } from "@/lib/i18n";

export function VerifyForm() {
  const t = useTranslations();
  const locale = useLocale();
  const {
    otp,
    setOtp,
    isLoading,
    onSubmit
  } = useVerifyForm();

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="w-full max-w-5xl rounded-[28px] bg-white dark:bg-gray-900 shadow-2xl border border-black/5 dark:border-gray-700 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
            <CardHeader className="space-y-4 p-0">
              <div className="flex items-center justify-center gap-3">
                <Image src="/logo.png" alt="Logo" width={120} height={42} />
              </div>
              <div className="space-y-2 text-center">
                <CardTitle className="text-2xl sm:text-3xl font-semibold text-foreground">
                  {t("Verify Your Account")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("We've sent a verification code to your email or phone")}
                </p>
              </div>
            </CardHeader>

            <CardContent className="mt-8 p-0">
              <form
                onSubmit={onSubmit}
                className="space-y-5 mt-6"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">
                    {t("Verification Code")}
                  </Label>
                  <div className="relative group">
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="123456"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="h-11 rounded-full border border-border/70 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-4 shadow-sm focus-visible:ring-1 focus-visible:ring-black/20 dark:focus-visible:ring-white/20 text-center tracking-[0.5em] text-lg font-bold"
                    />
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  </div>
                </div>

                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full h-11 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-100 font-semibold text-sm tracking-wide shadow-md"
                  variant="default"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-r-transparent animate-spin"></span>
                      <span>{t("Verifying")}</span>
                    </div>
                  ) : (
                    t("Verify Account")
                  )}
                </Button>

                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t("Didn't receive the code?")}{" "}
                    <button type="button" className="font-semibold text-foreground hover:underline">
                      {t("Resend")}
                    </button>
                  </p>
                  <Link
                    href="/signin"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← {t("Back to Sign In")}
                  </Link>
                </div>
              </form>

              <footer className="mt-8 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()}{" "}
                <Link
                  href={"https://www.neovidia.com/"}
                  target="_blank"
                  className="font-semibold text-foreground"
                >
                  Neovida
                </Link>
              </footer>
            </CardContent>
          </div>

          <div className="relative hidden md:block bg-gradient-to-br from-teal-900 via-slate-900 to-black">
            <div className="absolute inset-0">
              <Image
                src="/login-delivery.svg"
                alt="Verification illustration"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/40 via-slate-900/30 to-slate-950/70" />
            </div>
            <div className="absolute inset-x-8 bottom-8 rounded-2xl bg-white/95 dark:bg-gray-900/95 p-4 shadow-lg">
              <p className="text-sm font-medium text-foreground">
                {t("Secure verification process")}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("One more step to access your smart dispatch dashboard")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
