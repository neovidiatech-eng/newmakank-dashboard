import { useLocale } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { IoReturnDownBackOutline } from "react-icons/io5";

export default function BackButton() {
  const router = useRouter();
  const locale = useLocale();
  return (
    <button
      style={{
        rotate: locale !== "ar" ? "180deg" : "0deg"
      }}
      onClick={() => {
        router.back();
      }}
    >
      <IoReturnDownBackOutline className="text-[20px] hover:text-primary" />
    </button>
  );
}
