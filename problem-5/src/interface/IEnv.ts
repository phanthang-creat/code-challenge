import type { Dialect } from "sequelize"
import { Provider } from "nconf";

export interface NconfOptions extends Provider {
    get(key: "Database"): DatabaseConfig;
    get(key: "NODE_ENV"): string;
    get(key: "App"): AppConfig;
    get(key: "Swagger"): SwaggerConfig;
}

export type ENVConfig = {
    database: DatabaseConfig;
    app: AppConfig;
    swagger: SwaggerConfig;
}

export type AppConfig = {
    env: string;
    port: number;
    host: string;
    prefix: string;
}

export type SwaggerConfig = {
    json: string;
    url: string;
}

export type DatabaseConfig = {
    dialect: Dialect;
    name: string;
    username: string;
    password: string;
    host: string;
    port: number;
}