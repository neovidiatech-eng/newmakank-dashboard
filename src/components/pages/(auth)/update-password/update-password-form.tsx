import { ChangePasswordForm } from "@/components/change-password-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { useTranslations } from "@/lib/i18n";
import { LuLock } from "react-icons/lu";

export function UpdatePasswordForm() {
  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn("flex w-full justify-between items-center me-6 text-sm font-medium ")}
        >
          {t("Update Password")}
          <LuLock className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <ChangePasswordForm />
      </DialogContent>
    </Dialog>
  );
}
