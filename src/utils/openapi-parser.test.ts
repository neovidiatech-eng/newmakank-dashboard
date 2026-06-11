import { parseOpenAPISpec, isOpenAPISpec } from "@/utils/openapi-parser";

// Test data - a simplified OpenAPI spec
const testOpenAPISpec = {
	openapi: "3.0.0",
	paths: {
		"/api/users": {
			get: {
				operationId: "UserController_getAll",
				parameters: [
					{
						name: "page",
						in: "query",
						schema: { type: "number" },
					},
					{
						name: "limit",
						in: "query",
						schema: { type: "number" },
					},
				],
				responses: { "200": { description: "" } },
				tags: ["Users"],
				security: [{ "ACCESS Token": [] }],
			},
			post: {
				operationId: "UserController_create",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								properties: {
									name: { type: "string" },
									email: { type: "string" },
									active: { type: "boolean" },
								},
								required: ["name", "email"],
							},
						},
					},
				},
				responses: { "201": { description: "" } },
				tags: ["Users"],
			},
		},
		"/api/users/{id}": {
			get: {
				operationId: "UserController_getOne",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "number" },
					},
				],
				responses: { "200": { description: "" } },
				tags: ["Users"],
				security: [{ "ACCESS Token": [] }],
			},
			patch: {
				operationId: "UserController_update",
				parameters: [
					{
						name: "id",
						in: "path",
						required: true,
						schema: { type: "number" },
					},
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								properties: {
									name: { type: "string" },
									email: { type: "string" },
									status: {
										type: "string",
										enum: ["ACTIVE", "INACTIVE", "PENDING"],
									},
								},
							},
						},
					},
				},
				responses: { "200": { description: "" } },
				tags: ["Users"],
			},
		},
	},
	components: {
		securitySchemes: {
			"ACCESS Token": {
				scheme: "bearer",
				bearerFormat: "JWT",
				type: "http",
			},
		},
	},
};

// Test isOpenAPISpec
console.log("Testing isOpenAPISpec:");
console.log("Valid OpenAPI spec:", isOpenAPISpec(testOpenAPISpec)); // Should be true
console.log("Invalid (no paths):", isOpenAPISpec({ openapi: "3.0.0" })); // Should be false
console.log("Invalid (no openapi):", isOpenAPISpec({ paths: {} })); // Should be false
console.log("Invalid (null):", isOpenAPISpec(null)); // Should be false

// Test parseOpenAPISpec
console.log("\nTesting parseOpenAPISpec:");
const parsedItems = parseOpenAPISpec(testOpenAPISpec);
console.log("Parsed items count:", parsedItems.length); // Should be 4
console.log("\nParsed items:");
parsedItems.forEach((item) => {
	console.log(`- ${item.method} ${item.path}`);
	console.log(`  Name: ${item.name}`);
	console.log(`  Inputs: ${item.inputs.length}`);
	item.inputs.forEach((input) => {
		console.log(`    - ${input.name} (${input.type})`);
	});
});
