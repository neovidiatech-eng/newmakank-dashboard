import { Button } from "@/components/ui/button";
import { useGlobalLoading } from "@/lib/global-loading";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";

function SubmitSection({
  id,
  disabled,
  btnName
}: {
  btnName?: string;
  id?: string | number;
  disabled?: boolean;
}) {
  const router = useRouter();
  const t = useTranslations();
  const loading = useGlobalLoading();
  return (
    <div className="flex items-center !mt-3 justify-end gap-0.5">
      <Button
        data-testid={"cancel-edit"}
        variant="destructive"
        // style={{ backgroundColor: "#D3D3D3" }}
        type="button"
        onClick={() => router.back()}
      >
        {t("cancel")}
      </Button>
      &nbsp;
      <Button
        variant="default"
        type="submit"
        data-testid={"submit-form"}
        disabled={disabled ?? loading}
        className="bg-green-500 hover:bg-green-400"
      >
        {btnName ? t(`${btnName}`) : t(!id ? "create" : "update")}
      </Button>{" "}
    </div>
  );
}

export default SubmitSection;
