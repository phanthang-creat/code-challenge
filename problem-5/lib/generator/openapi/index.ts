 
import { readdirSync, readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { OAS3Options } from "swagger-jsdoc";

export default async (): Promise<OAS3Options> => {
	const root = resolve(__dirname, "../../../src");
	const schemaPath = `${__dirname}/schemas`;
	const generatedSchemas = {};
	if (existsSync(schemaPath))
		for (const fileName of readdirSync(schemaPath))
			Object.assign(generatedSchemas, JSON.parse(readFileSync(`${schemaPath}/${fileName}`, "utf8")));

	return {
		definition: {
			openapi: "3.0.3",
			info: { version: "1.0.0", title: "Fosco ERP", description: "Coded by MeU Team" },
			components: {
				securitySchemes: {
					Bearer: {
						name: "Authorization",
						in: "header",
						type: "http",
						scheme: "bearer",
					},
				},
				parameters: {
					// Fetch queries
					filters: {
						name: "filters",
						in: "query",
						description: "filter, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax",
						schema: { type: "string" },
					},
					sortField: {
						name: "sortField",
						in: "query",
						description: "sortField, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax",
						schema: { type: "string" },
					},
					sortOrder: {
						name: "sortOrder",
						in: "query",
						description: "sort order, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax",
						schema: { type: "string" },
					},
					page: {
						name: "page",
						in: "query",
						description: "page, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax",
						schema: { type: "number" },
					},
					pageSize: {
						name: "pageSize",
						in: "query",
						description: "pageSize, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax",
						schema: { type: "number" },
					},
					attributes: {
						name: "attributes",
						in: "query",
						description: "attributes, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax",
						schema: { type: "string" },
					},
					// Mutate queries
					filtersMutate: {
						name: "filters",
						in: "query",
						description: "filter, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax",
						schema: { type: "string" },
						required: true,
					},
					// Filter options
					searchQuery: {
						name: "searchQuery",
						in: "query",
						schema: { type: "string" },
					},
					preSelected: {
						name: "preSelected",
						in: "query",
						schema: { type: "string" },
					},
				},
				schemas: generatedSchemas,
			},
		},
		apis: [resolve(root, "controllers/api/**/*.ts")],
	};
};
