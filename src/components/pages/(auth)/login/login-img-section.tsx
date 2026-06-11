import { useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";

export default function LoginImgSection(): JSX.Element {
  const t = useTranslations();
  return (
    <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-rose-900/20 z-0" />
      <div className="absolute w-96 h-96 bg-orange-200/30 dark:bg-orange-600/10 rounded-full -top-20 -left-20 blur-3xl animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-amber-200/30 dark:bg-amber-600/10 rounded-full -bottom-10 -right-10 blur-2xl"></div>
      <div className="absolute w-72 h-72 bg-rose-200/20 dark:bg-rose-600/10 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>

      <div className="relative z-10 text-center max-w-2xl">
        <div className="mb-8 flex items-center justify-center gap-4">
          <Image src="/logo.png" alt="Logo" width={160} height={100} className="mx-auto" />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {t("Delivery Network")}
            </span>
            <span className="text-lg font-semibold text-foreground">{t("Dispatch HQ")}</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
          <span className="block mb-3 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 bg-clip-text text-transparent">
            {t("Delivery Operations Dashboard")}
          </span>
          <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground">
            {t("Fast, reliable logistics for every order")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8">
          {t("Monitor orders route drivers and keep customers informed in real time")}
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex flex-col items-center p-4 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-lg border border-orange-200/50 dark:border-orange-600/20">
            <div className="w-3 h-3 bg-orange-500 rounded-full mb-2"></div>
            <span className="text-sm font-medium text-center">{t("Live Order Tracking")}</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-lg border border-amber-200/50 dark:border-amber-600/20">
            <div className="w-3 h-3 bg-amber-500 rounded-full mb-2"></div>
            <span className="text-sm font-medium text-center">{t("Driver Performance")}</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-lg border border-rose-200/50 dark:border-rose-600/20">
            <div className="w-3 h-3 bg-rose-500 rounded-full mb-2"></div>
            <span className="text-sm font-medium text-center">{t("Smart Dispatch")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
