import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import FortuneWheelClient from "./FortuneWheelClient";

export default async function FortuneWheelPage(): Promise<JSX.Element> {
  const t = await getTranslations();

  return (
    <>
      <CustomHeader />
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("fortuneWheel")}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t("fortuneWheelPageIntro")}
          </p>
        </div>
        <FortuneWheelClient />
      </div>
    </>
  );
}
