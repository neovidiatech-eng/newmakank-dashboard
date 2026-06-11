import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/i18n";
import Link from "@/lib/Link";
import { usePathname } from "@/lib/navigation";
function CreateNewLink() {
  const pathname = usePathname();
  const t = useTranslations();
  return (
    <Link href={`${pathname}/create`}>
      <Button className="bg-black">{t("Create New")}</Button>
    </Link>
  );
}

export default CreateNewLink;
