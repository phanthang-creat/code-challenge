import { resolve } from "path";
import nconf from "nconf";
import type { NconfOptions } from "@interface/IEnv";

export const root = resolve(__dirname, "../");
export const src = resolve(__dirname);
export const envConfig: NconfOptions = nconf.env({
	separator: "__",
	transform(obj: { key: string; value: unknown }) {
		if (obj.key == "NODE_ENV") obj.value = (obj.value as string).toLowerCase();
		if (obj.key == "Port") obj.value = parseInt(obj.value as string);
		return obj;
	},
});
