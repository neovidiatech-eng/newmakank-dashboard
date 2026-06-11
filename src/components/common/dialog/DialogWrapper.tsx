import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useLocale, useTranslations } from "@/lib/i18n";
import { useState } from "react";

 const useDialogState = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return [isDialogOpen, setIsDialogOpen] as const;
}
export { useDialogState };
export default function DialogWrapper({
  // action,
  // loading,
  title,
  description,
  children,
  isDialogOpen,
  setIsDialogOpen
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  // loading: boolean;
  // action: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div
        className={`${isDialogOpen ? "fixed" : "hidden"} inset-0 ${
          locale == "ar" ? "text-start" : ""
        } bg-opacity-100 z-40`}
      />{" "}
      {/* Backdrop */}
      <DialogContent className="sm:max-w-[425px]  fixed top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 overflow-y-auto max-h-[70%]  rounded-lg shadow-xl">
        <DialogHeader>
          {title && <DialogTitle>{t(title)}</DialogTitle>}
          {description && <DialogDescription>{t(description)}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter className="gap-2"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
