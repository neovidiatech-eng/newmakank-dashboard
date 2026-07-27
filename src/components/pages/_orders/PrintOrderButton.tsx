"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

export default function PrintOrderButton() {
  const t = useTranslations();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.print()}
      className="gap-2 text-xs border-primary/20 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 shadow-sm"
    >
      <Printer className="h-4 w-4 text-primary" />
      {t("Print") || "طباعة"}
    </Button>
  );
}
