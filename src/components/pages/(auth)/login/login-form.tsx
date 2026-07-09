import CustomPhoneInput from "@/components/common/Inputs/phone/PhoneInput";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useLoginForm } from "@/features/auth/login/hooks/use-login-form";
import { Activity, Eye, EyeOff, Lock, Mail, MapPinned, PackageCheck, Store, Truck } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import Link from "@/lib/Link";

export function LoginForm() {
  const t = useTranslations();
  const {
    locale,
    loginType,
    setLoginType,
    phoneNumber,
    setPhoneNumber,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    onSubmit
  } = useLoginForm();

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="w-full max-w-5xl rounded-[28px] bg-white dark:bg-gray-900 shadow-2xl border border-black/5 dark:border-gray-700 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
            <CardHeader className="space-y-4 p-0">
              <div className="flex items-center justify-center gap-3">
                <Image src="/logo.png" alt="Logo" width={120} height={42} />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl font-semibold text-foreground">
                  {t("Sign in to your account")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("Manage routes, riders, and daily dispatch operations from one place")}
                </p>
              </div>
            </CardHeader>

            <CardContent className="mt-8 p-0">
              <Tabs
                defaultValue="email"
                className="w-full"
                onValueChange={value => setLoginType(value as "email" | "phone")}
              >
                <form
                  onSubmit={onSubmit}
                  className="space-y-5 mt-6"
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  <TabsContent value="email" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        {t("Email")}
                      </Label>
                      <div className="relative group">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="name@company.com"
                          required={loginType === "email"}
                          className="h-11 rounded-full border border-border/70 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-4 shadow-sm focus-visible:ring-1 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        {t("Phone")}
                      </Label>
                      <CustomPhoneInput
                        name="phone"
                        placeholder={t("Enter your phone number")}
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                      />
                    </div>
                  </TabsContent>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-sm font-medium">
                        {t("Password")}
                      </Label>
                    </div>
                    <div className="relative group">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="h-11 rounded-full border border-border/70 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-12 shadow-sm focus-visible:ring-1 focus-visible:ring-black/20 dark:focus-visible:ring-white/20"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
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
                        <span>{t("Processing")}</span>
                      </div>
                    ) : (
                      t("Sign In")
                    )}
                  </Button>
                </form>
              </Tabs>

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

          <div className="relative hidden overflow-hidden md:block bg-[#0b1626]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,118,110,0.32),rgba(15,23,42,0.88)_48%,rgba(2,6,23,1))]" />
            <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:88px_88px]" />
            <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />

            <div className="relative z-10 flex h-full min-h-[640px] flex-col justify-between p-10">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur">
                  <Activity className="h-4 w-4 text-emerald-300" />
                  {t("Live dashboard")}
                </div>
                <div className="max-w-md space-y-3">
                  <h2 className="text-3xl font-semibold leading-tight text-white">
                    {t("Makank operations center")}
                  </h2>
                  <p className="text-sm leading-6 text-slate-300">
                    {t("Track orders stores couriers and service zones from one focused control panel")}
                  </p>
                </div>
              </div>

              <div className="relative mx-auto my-8 h-[360px] w-full max-w-[430px]">
                <div className="absolute left-4 top-4 w-48 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="rounded-xl bg-emerald-400/15 p-2 text-emerald-200">
                      <PackageCheck className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-emerald-200">{t("Today")}</span>
                  </div>
                  <p className="text-3xl font-semibold text-white">248</p>
                  <p className="mt-1 text-xs text-slate-300">{t("Orders")}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-3/4 rounded-full bg-emerald-300" />
                  </div>
                </div>

                <div className="absolute right-0 top-24 w-52 rounded-2xl border border-white/10 bg-slate-950/55 p-4 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-sky-400/15 p-2 text-sky-200">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t("Delivery")}</p>
                      <p className="text-xs text-slate-400">{t("Active couriers")}</p>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-5 items-end gap-2">
                    {[42, 66, 50, 82, 70].map((height, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-sky-300/80"
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-8 left-10 w-56 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{t("Stores")}</p>
                      <p className="text-xs text-slate-400">{t("Branches and service coverage")}</p>
                    </div>
                    <Store className="h-5 w-5 text-amber-200" />
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-amber-300" />
                    <span className="h-3 w-12 rounded-full bg-white/20" />
                    <span className="h-3 w-20 rounded-full bg-white/35" />
                  </div>
                </div>

                <div className="absolute bottom-0 right-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 shadow-2xl backdrop-blur-md">
                  <MapPinned className="h-5 w-5 text-rose-200" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t("Zones")}</p>
                    <p className="text-xs text-slate-400">{t("Coverage is ready")}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold text-white">99%</p>
                  <p className="mt-1 text-xs text-slate-300">{t("Uptime")}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold text-white">18</p>
                  <p className="mt-1 text-xs text-slate-300">{t("Zones")}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold text-white">64</p>
                  <p className="mt-1 text-xs text-slate-300">{t("Stores")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
