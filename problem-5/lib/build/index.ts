 
// Builder reqs
import { build } from "esbuild";
import { sys, readConfigFile, findConfigFile, parseJsonConfigFileContent, ParsedCommandLine } from "typescript";
import clc from "cli-color";

// Prebuild reqs
import swaggerConfig from "../generator/openapi";
import swaggerJSDoc from "swagger-jsdoc";
import { resolve } from "path";
import { mkdir, rm } from "fs/promises";
import { existsSync, mkdirSync, writeFileSync } from "fs";
// const { execSync } = require("child_process");

const message = clc.green("Build time");
const cwd = process.cwd();
// const isDevEnv = process.env.NODE_ENV?.toLowerCase() == "development";

console.log("Initiate build on: " + new Date().toLocaleString("vi-VN"));
console.time(message);
(async function () {
	const { esbuildOptions } = getEsbuildMetadata({ esbuild: { minify: false, keepNames: true } });
	const buildPath = resolve(__dirname, "../../dist");
	const templatePath = resolve(buildPath, "templates");
	// const buildConfigPath = resolve(buildPath, "config");
	// Pre build functions here
	// Create build folder
	if (existsSync(buildPath)) await rm(buildPath, { recursive: true });

	await mkdir(buildPath);
	await generateSwagger(templatePath);

	// Builder
	await build({
		bundle: false,
		format: "cjs",
		platform: "node",
		...esbuildOptions,
	});

	// Copy paths
})()
	.then(() => {
		console.timeEnd(message);
		console.log();
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});

function getTSConfig(_tsConfigFile = "tsconfig.json") {
	const tsConfigFile = findConfigFile(cwd, sys.fileExists, _tsConfigFile);
	if (!tsConfigFile) throw new Error(`tsconfig.json not found in the current directory! ${cwd}`);

	const configFile = readConfigFile(tsConfigFile, sys.readFile);
	const tsConfig = parseJsonConfigFileContent(configFile.config, sys, cwd);
	return { tsConfig, tsConfigFile };
}
function esBuildSourceMapOptions(tsConfig: ParsedCommandLine) {
	const { sourceMap, inlineSources, inlineSourceMap } = tsConfig.options;
	// inlineSources requires either inlineSourceMap or sourceMap
	if (inlineSources && !inlineSourceMap && !sourceMap) return false;

	// Mutually exclusive in tsconfig
	if (sourceMap && inlineSourceMap) return false;

	if (inlineSourceMap) return "inline";

	return sourceMap;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getEsbuildMetadata(userConfig: { esbuild: any; tsConfigFile?: string | undefined; }) {
	const { tsConfig, tsConfigFile } = getTSConfig(userConfig.tsConfigFile);
	const esbuildConfig = userConfig.esbuild || {};
	const outdir = esbuildConfig.outdir || tsConfig.options.outDir || "dist";
	const srcFiles = [...(esbuildConfig.entryPoints ?? []), ...tsConfig.fileNames];
	const sourcemap = userConfig.esbuild?.sourcemap || esBuildSourceMapOptions(tsConfig);
	const target = esbuildConfig?.target || tsConfig?.raw?.compilerOptions?.target || "esNext";
	const esbuildOptions = {
		...userConfig.esbuild,
		outdir,
		entryPoints: srcFiles,
		sourcemap,
		target: target.toLowerCase(),
		tsconfig: tsConfigFile,
	};
	return { esbuildOptions };
}

async function generateSwagger(storagePath: string) {
	const swaggerGenMessage = clc.greenBright("OpenAPI generated in: ");
	console.time(swaggerGenMessage);
	const spec = swaggerJSDoc(await swaggerConfig());
	const swaggerServePath = `${storagePath}/swagger/`;

	mkdirSync(swaggerServePath, { recursive: true });
	writeFileSync(`${swaggerServePath}/openapi.json`, JSON.stringify(spec));
	console.timeEnd(swaggerGenMessage);
	return;
}
