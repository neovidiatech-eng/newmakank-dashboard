import { getLocale } from "@/lib/i18n";
import { routesKey } from "../routes";

export async function handleLinkServer(link: routesKey) {
	const locale = await getLocale();
	return `/${locale}${link}`;
}
