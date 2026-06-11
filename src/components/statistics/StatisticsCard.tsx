import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useTranslations } from "@/lib/i18n";
import { ReactNode } from "react";

interface StatisticsCardProps {
  title: string;
  value: string | number | ReactNode;
  icon: ReactNode;
  className?: string;
  motionProps?: HTMLMotionProps<"div">;
}

export function StatisticsCard({
  title,
  value,
  icon,
  className,
  motionProps
}: StatisticsCardProps) {
  const t = useTranslations();
  const { className: motionClassName, ...restMotionProps } = motionProps ?? {};

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-700/60 bg-white/90 dark:bg-gray-800/80 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        motionClassName
      )}
      {...restMotionProps}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t(title)}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div
          className={cn(
            "p-3 rounded-full shadow-sm ring-1 ring-white/60 dark:ring-gray-900/40 transition-transform duration-200 group-hover:scale-105",
            className
          )}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
