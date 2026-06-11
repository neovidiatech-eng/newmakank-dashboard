import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";

function KeyLabel({ label, className }: { label: string; className?: string }): JSX.Element {
  const t = useTranslations();
  return (
    <span
      className={cn(
        "text-nowrap font-semibold text-muted-foreground text-sm capitalize",
        className
      )}
    >
      {t(label)}:
    </span>
  );
}

export default KeyLabel;
