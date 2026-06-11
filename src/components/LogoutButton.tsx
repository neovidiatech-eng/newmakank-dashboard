import { removeToken } from "@/api/actions";
import { fetchHelper } from "@/api/fetch";

import { useTranslations } from "@/lib/i18n";
import { useParams, useRouter } from "@/lib/navigation";
import React from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { toast } from "sonner";

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations();

  const handleLogout = async () => {
    try {
      await removeToken();
      router.push(`/${locale}/signin`);
      fetchHelper({
        endPoint: ['logout'],
        method: "POST"
      });
    } catch (error) {
      toast.error(t(`${error}`));
      router.push(`/${locale}/signin`);
      await removeToken();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-between gap-2 w-full dark:!text-white py-2 text-sm font-medium text-gray-700 rounded-lg  hover:text-red-700 transition-colors group"
    >
      {t("Logout")}
      <RiLogoutBoxRLine className="size-4 mr-2 text-gray-400 group-hover:text-red-600" size={20} />
    </button>
  );
};

export default LogoutButton;
