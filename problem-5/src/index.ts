import { addAliases } from "module-alias";
// import {} from "module-alias/register.js";

export const FOLDERS = [
	"config",
	"controllers",
	"dto",
	"interfaces",
	"middlewares",
	"models",
	"providers",
	"services",
	"templates",
	"constants",
];

export async function main() {
	addAliases({
		"@": __dirname,
		...FOLDERS.reduce(
			(folderAlias: Record<string, string>, folder: string) => 
				Object.assign(folderAlias, { [`@${folder}`]: `${__dirname}/${folder}` }),
			{},
		),
	});

	const { startServer } = await import("./server.js");
	return await startServer();
}

main().catch((err) => console.error(err));
