import { routesKey } from "../routes";

export function handleLinkClient(link: routesKey, locale: string) {
	return `/${locale}${link}`;
}
