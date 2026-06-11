import { APIDelete } from "@/api/global/apiDelete";
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
import { endpointType } from "@/utils/endpoints";
import { useLocale, useTranslations } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "sonner";

export default function DeleteBtn({
  onDelete,
  id
}: {
  onDelete: endpointType;
  id: string;
}): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const handleDelete = async () => {
    setLoading(true);
    const res = await APIDelete(onDelete, pathname, id);
    if (res.success) {
      toast.success(t("Deleted"), {
        description: t("Item has been deleted successfully")
      });
      router.refresh();
    } else {
      toast.error(t("Error"), {
        description: t(`${res.message}`)
      });
    }
    setIsDialogOpen(false);
    setLoading(false);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <ExpandableButton
          icon={<AiOutlineDelete />}
          variant="destructive"
          className="bg-transparent text-red-500 hover:text-white border border-red-500 hover:bg-red-500 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-400 dark:hover:text-white"
        />
      </DialogTrigger>
      <div
        className={`${isDialogOpen ? "fixed" : "hidden"} inset-0 ${locale == "ar" ? "text-start" : ""
          } bg-black/50 dark:bg-black/70 z-40`}
      />
      <DialogContent className="sm:max-w-[425px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            {t("Confirm Delete")}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {t("Are you sure you want to delete this item? This action cannot be undone")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t("Cancel")}
          </Button>
          <Button
            data-testid="delete-confirm-btn"
            disabled={loading}
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("Deleting") : t("Delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
