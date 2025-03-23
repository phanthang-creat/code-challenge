const { resolve } = require("path");
const { writeFileSync, existsSync, readFileSync, mkdirSync } = require("fs");
const { execSync } = require("child_process");

const Mustache = require("mustache");
const nconf = require("nconf");
const rl = require("readline/promises").createInterface(process.stdin, process.stdout);

// Paths
const root = resolve(__dirname, "../../../src");
const templatePath = resolve(__dirname, "templates");
const configPath = resolve(root, "config", `${process.env.NODE_ENV?.toLowerCase()}.json`);
const controllerPath = resolve(root, "controllers/api");
const modelPath = resolve(root, "models");

// Mustache template
const controllerAllFile = readFileSync(`${templatePath}/controllerAllPath.mustache`, { encoding: "utf-8" });
const controllerIdFile = readFileSync(`${templatePath}/controllerIdPath.mustache`, { encoding: "utf-8" });

nconf.argv().env().file({ file: configPath });

execute();

async function execute() {
	//==================================================== Choose module ====================================================
	/** @type {[import("../../../src/interfaces/IEnv").DatabaseKeys, import("../../../src/interfaces/IEnv").DatabaseConfig]} */
	// const dbs = Object.entries(nconf.get("Database"));

	/** @type {import("../../../src/interfaces/IEnv").DatabaseKeys} */
	const module = (await rl.question(`Input your module (check your provider): `)).trim();
	rl.pause();
	// if (!dbs.some(([key]) => key == module)) return console.error("No module matched your input");

	//==================================================== Init Model ====================================================
	const model = (await rl.question("Input your model: ")).trim();
	rl.pause();

	// Check if model exists
	const filePathToCheck = resolve(modelPath, model + ".ts");
	// dbs.length < 1 ? resolve(modelPath, model + ".ts") : resolve(modelPath, module, model + ".ts");
	if (!existsSync(filePathToCheck)) return console.error("No model matched your input");

	//==================================================== Init API Path ====================================================

	const modelUpperCase = hyphensToCamelCase(model).replace(/^./, model[0].toUpperCase());
	let apiPathLink = await rl.question("Input your api link (Leave blank if same as model): ");
	if (apiPathLink.length == 0) apiPathLink = model;

	//==================================================== Init Swagger ====================================================
	let swaggerTag = await rl.question("Input your Swagger Tag (leave blank if same as model): ");
	if (swaggerTag.length == 0) swaggerTag = modelUpperCase;
	// const swaggerTag = hyphensToCamelCase(module).replace(/^./, module[0].toUpperCase());

	//==================================================== Write API ====================================================
	const replace = {
		modelUpperCase,
		modelLowerCase: hyphensToCamelCase(model),
		model,
		module: /*(dbs.length == 0 ? "" : `${module}/`)*/ `${module}/` + model,
		swaggerTag,
		apiPathLink,
		operation: capitalizeFirstLetter(slashToCamelCase(apiPathLink.replaceAll("{", "").replaceAll("}", ""))),
	};

	// Path
	const apiPath = resolve(controllerPath, apiPathLink);

	mkdirSync(apiPath, { recursive: true });
	writeFileSync(`${apiPath}/index.ts`, Mustache.render(controllerAllFile, replace));
	writeFileSync(`${apiPath}/{id}.ts`, Mustache.render(controllerIdFile, replace));

	rl.close();
	execSync("pnpm run prettier:fix", { stdio: "inherit" });
	return;
}

// UTIL
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function hyphensToCamelCase(myString) {
	return myString.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function slashToCamelCase(myString) {
	return myString.replace(/\/([a-z])/g, (g) => g[1].toUpperCase());
}
