import { DynamicStatisticsClient } from "@/features/statistics/components/DynamicStatisticsClient";
import { useTranslations } from "@/lib/i18n";

export default function DynamicStatisticsPage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center gap-10 max-w-7xl w-full mx-auto px-4 py-6 defer-paint">
      <div className="relative w-full overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-white via-white to-slate-50/80 px-6 py-8 shadow-sm dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/70">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl opacity-50" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl opacity-50" />
        <div className="relative text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            {t("dashboard.statistics") || "Analytics & Statistics"}
          </p>
          <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--brand-1))] to-[hsl(var(--brand-2))]">
            Dynamic Insights Explorer
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-200 max-w-2xl mx-auto">
            Select an endpoint from the platform, dynamically map axes, and generate stunning
            interactive charts. Analyze records instantly without custom implementations.
          </p>
        </div>
      </div>

      <div className="w-full">
        <DynamicStatisticsClient />
      </div>
    </div>
  );
}
