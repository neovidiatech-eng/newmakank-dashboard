import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useTranslations } from "@/lib/i18n";
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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px] z-50 overflow-y-auto max-h-[70%] rounded-lg shadow-xl">
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
