'use client'
import { columnsIcons, mainIcons } from "@/utils/icons";
import { LucideIcon } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface IconHeaderProps {
  columnKey: string;
}

export default function IconHeader({ columnKey }: IconHeaderProps) {
  const t = useTranslations();
  const Icon = (mainIcons[columnKey as keyof typeof mainIcons] || columnsIcons[columnKey as keyof typeof columnsIcons]) as LucideIcon;

  if (!Icon) {
    return <span>{t(columnKey)}</span>;
  }

  return (
    <div className="flex items-center gap-1">
      <Icon className="w-4 h-4" />
      {t(columnKey)}
    </div>
  );
}
