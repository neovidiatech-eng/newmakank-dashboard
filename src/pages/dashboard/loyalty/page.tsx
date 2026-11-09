import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import LoyaltyClient from "./LoyaltyClient";

export default async function LoyaltyPage(): Promise<JSX.Element> {
  const t = await getTranslations();

  return (
    <>
      <CustomHeader />
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("loyaltyPoints")}</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("loyaltyPageIntro")}</p>
        </div>
        <LoyaltyClient />
      </div>
    </>
  );
}
