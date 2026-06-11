import { useEffect } from "react";
import { REFRESH_TOKEN, TOKEN } from "@/utils/config";

export default function Page() {
  useEffect(() => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.replace("/ar/signin");
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">جاري تسجيل الخروج...</h2>
        <p className="mt-2 text-sm text-gray-500">يرجى الانتظار قليلاً</p>
      </div>
    </div>
  );
}
