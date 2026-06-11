import { getLocale } from "@/lib/i18n";
import { redirect } from "@/lib/navigation";

export const redirectServer = async (redirectLink?: string) => {
  if (redirectLink) {
    const locale = await getLocale();
    redirect(`/${locale}${redirectLink}`);
    return;
  }

  redirect(cleanPath(window.location.pathname));
};

function cleanPath(path: string): string {
  return path.replace(/\/(?:\d+\/edit|create)$/, "");
}
