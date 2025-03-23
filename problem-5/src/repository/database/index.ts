import { Sequelize } from "sequelize";
import { initModels } from "../model/init-models";
import { envConfig } from "@/root";

const databaseConfig = envConfig.get("Database");
const loggingFunc = async (sql: string) => {
	if (envConfig.get("NODE_ENV") == "development") {
		const { default: clc } = await import("cli-color");
		const [executer, query] = sql.split(": ");
		console.log(`${clc.cyanBright(executer)}: ${query}\n`);
	}
};

export const sequelize = databaseConfig.url
	? new Sequelize(databaseConfig.url, { logging: loggingFunc })
	: new Sequelize({
		username: databaseConfig.username,
		password: databaseConfig.password,
		database: databaseConfig.name,
		host: databaseConfig.host,
		port: databaseConfig.port,
		dialect: databaseConfig.dialect,
		logging: loggingFunc,
	});
export const db = initModels(sequelize);

export default db;
