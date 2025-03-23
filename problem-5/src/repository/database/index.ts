import { Sequelize } from "sequelize";
import { initModels } from "../model/init-models";
import { envConfig } from "@/root";

const databaseConfig = envConfig.get("Database");
console.log("databaseConfig", databaseConfig);	
export const sequelize = new Sequelize({
	username: databaseConfig.username,
	password: databaseConfig.password,
	database: databaseConfig.name,
	host: databaseConfig.host,
	port: databaseConfig.port,
	dialect: databaseConfig.dialect,
	async logging(sql) {
		if (envConfig.get("NODE_ENV") == "development") {
			const { default: clc } = await import("cli-color");
			const [executer, query] = sql.split(": ");
			console.log(`${clc.cyanBright(executer)}: ${query}\n`);
		}
	},
});
export const db = initModels(sequelize);

export default db;
