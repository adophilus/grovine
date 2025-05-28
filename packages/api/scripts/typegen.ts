import openapiTS, { astToString } from "openapi-typescript";
import openapiSchema from "@grovine/docs-openapi/openapi.yaml?raw";
import { writeFile } from "node:fs/promises";
import { generateZodClientFromOpenAPI } from "openapi-zod-client";
import SwaggerParser from "@apidevtools/swagger-parser";
import type { oas30 } from "openapi3-ts";

const _types = astToString(await openapiTS(openapiSchema));

await writeFile("./src/api/types.ts", _types);

const openApiDoc = (await SwaggerParser.bundle(
	"../docs-openapi/build/openapi.yaml",
)) as oas30.OpenAPIObject;

await generateZodClientFromOpenAPI({
	openApiDoc,
	distPath: "./src/api/schema.ts",
	options: {
		withAlias: false,
		shouldExportAllSchemas: true,
	},
});

console.log("✅ Generated types");
