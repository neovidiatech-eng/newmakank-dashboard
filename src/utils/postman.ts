import type { FormInput, inputTypes } from "@/components/common/Form/CustomFormTypes.types";
import { endpoints } from "@/utils/endpoints";

type PostmanCollection = {
	item?: PostmanItem[];
};

type PostmanItem = {
	name?: string;
	item?: PostmanItem[];
	request?: PostmanRequest;
};

type PostmanRequest = {
	method?: string;
	url?: string | PostmanUrl;
	body?: {
		mode?: string;
		raw?: string;
	};
};

type PostmanUrl = {
	raw?: string;
	path?: string[];
};

export type ParsedPostmanItem = {
	name: string;
	method: string;
	path: string;
	apiEndpoint: string;
	inputs: FormInput[];
	matchedEndpointKey: string | null;
};

const inferInputType = (value: unknown): inputTypes => {
	if (typeof value === "number") {
		return "number";
	}
	if (typeof value === "boolean") {
		return "checkbox";
	}
	if (Array.isArray(value)) {
		return "multiSelect";
	}
	if (value instanceof Date) {
		return "date";
	}
	if (typeof value === "object" && value !== null) {
		return "textarea";
	}
	return "text";
};

const sanitizePath = (path: string): string => {
	const cleaned = path.trim() || "/";
	const normalized = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
	const trimmed = normalized.replace(/\/$/, "");
	return trimmed.length > 0 ? trimmed : "/";
};

const stripDynamicSegments = (path: string): string => {
	const segments = path.split("/").filter(Boolean);
	const staticSegments: string[] = [];

	for (const segment of segments) {
		if (segment.startsWith(":") || segment.includes("{{") || segment.includes("{")) {
			break;
		}
		staticSegments.push(segment);
	}

	return staticSegments.length > 0 ? `/${staticSegments.join("/")}` : "/";
};

const extractPathFromUrl = (url?: string | PostmanUrl): string => {
	if (!url) {
		return "/";
	}

	if (typeof url !== "string") {
		if (url.path?.length) {
			return `/${url.path.join("/")}`;
		}
		if (url.raw) {
			return extractPathFromUrl(url.raw);
		}
		return "/";
	}

	const withoutVars = url.replace(/{{[^}]+}}/g, "");
	const withoutProtocol = withoutVars.replace(/^https?:\/\//, "");
	const pathIndex = withoutProtocol.indexOf("/");
	const path = pathIndex === -1 ? "" : withoutProtocol.slice(pathIndex);
	const cleanPath = path.split("?")[0];
	return cleanPath || "/";
};

const tryParseJson = (raw?: string): unknown | null => {
	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw);
	} catch (error) {
		return null;
	}
};

const buildInputsFromBody = (body: unknown): FormInput[] => {
	if (!body || typeof body !== "object" || Array.isArray(body)) {
		return [];
	}

	return Object.entries(body).map(([key, value]) => ({
		name: key,
		type: inferInputType(value),
		required: false,
		placeholder: key,
	}));
};

const toKebabCase = (value: string): string =>
	value
		.trim()
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "")
		.toLowerCase();

const cleanControllerName = (name: string): string => {
	return name.replace(/^Controller_/, "").replace(/Controller$/, "");
};

const findEndpointKey = (path: string): string | null => {
	const entry = Object.entries(endpoints).find(([, value]) => value === path);
	return entry ? entry[0] : null;
};

const collectItems = (items: PostmanItem[] = [], parentName?: string): ParsedPostmanItem[] => {
	return items.flatMap((item) => {
		if (item.item?.length) {
			return collectItems(item.item, item.name ?? parentName);
		}

		if (!item.request) {
			return [];
		}

		const method = item.request.method?.toUpperCase() ?? "GET";
		const rawPath = extractPathFromUrl(item.request.url);
		const sanitizedPath = sanitizePath(rawPath);
		const path = stripDynamicSegments(sanitizedPath);
		const endpointKey = findEndpointKey(path);
		const cleanedName = cleanControllerName(item.name ?? parentName ?? "");
		const lastPathSegment = path.split("/").pop() || "form";
		const fallbackName = toKebabCase(lastPathSegment || cleanedName);
		const apiEndpoint = endpointKey ? `["${endpointKey}"]` : `["${fallbackName}"]`;
		const bodyData =
			item.request.body?.mode === "raw" ? tryParseJson(item.request.body.raw) : null;
		const inputs = buildInputsFromBody(bodyData ?? undefined);

		return [
			{
				name: item.name ?? fallbackName,
				method,
				path,
				apiEndpoint,
				inputs,
				matchedEndpointKey: endpointKey,
			},
		];
	});
};

export const parsePostmanCollection = (collection: PostmanCollection): ParsedPostmanItem[] => {
	if (!collection?.item?.length) {
		return [];
	}

	return collectItems(collection.item);
};

export const normalizePostmanName = (value: string): string => {
	if (!value.trim()) {
		return "form";
	}

	return toKebabCase(value);
};
