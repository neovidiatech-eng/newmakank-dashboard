import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { endpoints } from "@/utils/endpoints";

interface OpenAPISpec {
	openapi?: string;
	paths?: Record<string, Record<string, OpenAPIOperation>>;
	components?: {
		schemas?: Record<string, OpenAPISchema>;
		securitySchemes?: Record<string, unknown>;
	};
}

interface OpenAPIOperation {
	operationId?: string;
	summary?: string;
	description?: string;
	parameters?: OpenAPIParameter[];
	requestBody?: {
		content?: Record<string, { schema?: OpenAPISchema }>;
		required?: boolean;
	};
	tags?: string[];
	responses?: Record<string, unknown>;
}

interface OpenAPIParameter {
	name?: string;
	in?: string;
	required?: boolean;
	schema?: OpenAPISchema;
	example?: unknown;
}

interface OpenAPISchema {
	type?: string;
	properties?: Record<string, OpenAPISchema>;
	items?: OpenAPISchema;
	$ref?: string;
	example?: unknown;
	enum?: string[];
	format?: string;
	required?: string[];
}

export interface ParsedOpenAPIItem {
	name: string;
	method: string;
	path: string;
	apiEndpoint: string;
	inputs: FormInput[];
	matchedEndpointKey: string | null;
}

const inferInputTypeFromSchema = (schema?: OpenAPISchema): FormInput["type"] => {
	if (!schema) return "text";

	if (schema.format === "binary") {
		return "file";
	}

	const type = schema.type?.toLowerCase();

	switch (type) {
		case "number":
		case "integer":
			return "number";
		case "boolean":
			return "checkbox";
		case "array":
			return "multiSelect";
		case "object":
			return "textarea";
		default:
			if (schema.enum?.length) {
				return "select";
			}
			return "text";
	}
};

const buildInputsFromParameters = (
	parameters?: OpenAPIParameter[],
): FormInput[] => {
	if (!parameters?.length) return [];

	return parameters
		.filter((param) => param.in !== "header" || param.name === "Locale")
		.map((param) => ({
			name: param.name || "param",
			type: inferInputTypeFromSchema(param.schema),
			required: param.in === "path" ? param.required ?? true : param.required || false,
			placeholder: param.name,
			...(param.schema?.enum && {
				options: param.schema.enum.map((value) => ({
					label: value,
					value,
				})),
			}),
		}));
};

const buildInputsFromRequestBody = (
	requestBody?: OpenAPIOperation["requestBody"],
): FormInput[] => {
	const schema =
		requestBody?.content?.["application/json"]?.schema ??
		requestBody?.content?.["application/x-www-form-urlencoded"]?.schema ??
		requestBody?.content?.["multipart/form-data"]?.schema;

	if (!schema) return [];
	if (!schema.properties) return [];

	return Object.entries(schema.properties).map(([key, prop]) => ({
		name: key,
		type: inferInputTypeFromSchema(prop),
		required: schema.required?.includes(key) || false,
		placeholder: key,
		...(prop.enum && {
			options: prop.enum.map((value) => ({
				label: String(value),
				value: String(value),
			})),
		}),
	}));
};

const findEndpointKey = (path: string): string | null => {
	const entry = Object.entries(endpoints).find(
		([, value]) => value === path,
	);
	return entry ? entry[0] : null;
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

const normalizePathForEndpoint = (path: string): string => {
	// Remove query parameters
	const cleanPath = path.split("?")[0];
	// Strip dynamic segments like Postman parser does
	const segments = cleanPath.split("/").filter(Boolean);
	const staticSegments: string[] = [];
	for (const segment of segments) {
		if (segment.includes("{") || segment.includes("}")) {
			break;
		}
		staticSegments.push(segment);
	}
	return staticSegments.length > 0 ? `/${staticSegments.join("/")}` : "/";
};

export const parseOpenAPISpec = (spec: OpenAPISpec): ParsedOpenAPIItem[] => {
	if (!spec.paths || typeof spec.paths !== "object") {
		return [];
	}

	const items: ParsedOpenAPIItem[] = [];

	for (const [path, methods] of Object.entries(spec.paths)) {
		if (!methods || typeof methods !== "object") continue;

		for (const [method, operation] of Object.entries(methods)) {
			if (method.startsWith("x-") || method === "parameters") continue;

			const op = operation as OpenAPIOperation;
			if (!op) continue;

			const httpMethod = method.toUpperCase();
			const normalizedPath = normalizePathForEndpoint(path);
			const endpointKey = findEndpointKey(normalizedPath);
			const operationName = op.operationId || op.summary || `${httpMethod} ${path}`;
			const cleanedOperationName = cleanControllerName(operationName);
			const lastPathSegment = normalizedPath.split("/").pop() || "form";
			const fallbackName = toKebabCase(lastPathSegment || cleanedOperationName);
			const apiEndpoint = endpointKey ? `["${endpointKey}"]` : `["${fallbackName}"]`;

			// Collect inputs from parameters and request body
			const parameterInputs = buildInputsFromParameters(op.parameters);
			const bodyInputs = buildInputsFromRequestBody(op.requestBody);
			const inputs = [...parameterInputs, ...bodyInputs];

			items.push({
				name: operationName,
				method: httpMethod,
				path: normalizedPath,
				apiEndpoint,
				inputs: inputs.length > 0 ? inputs : [],
				matchedEndpointKey: endpointKey,
			});
		}
	}

	return items;
};

export const isOpenAPISpec = (data: unknown): data is OpenAPISpec => {
	if (typeof data !== "object" || data === null) return false;
	const obj = data as Record<string, unknown>;
	return typeof obj.openapi === "string" && typeof obj.paths === "object";
};
