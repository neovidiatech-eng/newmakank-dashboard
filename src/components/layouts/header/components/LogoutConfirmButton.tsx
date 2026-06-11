import { removeToken } from "@/api/actions";
import { fetchHelper } from "@/api/fetch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ExpandableButton } from "@/components/ui/ExpandableButton";
import { LogOut } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useParams, useRouter } from "@/lib/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LogoutConfirmButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations();

  const handleLogout = async () => {
    try {
      await removeToken();
      router.push(`/${locale}/signin`);
      fetchHelper({
        endPoint: ["logout"],
        method: "POST"
      });
      setOpen(false);
    } catch (error) {
      toast.error(t(`${error}`));
      router.push(`/${locale}/signin`);
      await removeToken();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ExpandableButton
          type="button"
          icon={<LogOut className="h-5 w-5" />}
          label={t("Logout")}
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          aria-label={t("Logout")}

        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Confirm Logout")}</DialogTitle>
          <DialogDescription>{t("Are you sure you want to logout?")}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 flex sm">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {t("Cancel")}
          </Button>
          <Button type="button" variant="destructive" onClick={handleLogout}>
            {t("Logout")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
