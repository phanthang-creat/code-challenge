// import response from '@middleware/response';
import { ErrorProcessor } from "@interface/error";
import { ErrorResponseDTO } from "@interface/IApi";
import { AppConfig, SwaggerConfig } from "@interface/IEnv";
import bodyParser from "body-parser";
import compression from "compression";
import express, { NextFunction, Request, Response } from "express";
import autoroutes from "express-automatic-routes";
import { OAS3Definition } from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import { envConfig } from "./root";
import swaggerDocument from "./template/docs/openapi.json";
export const SWAGGER = {
    SWAGGER_ROUTER: "/swagger/index",
    SWAGGER_PATH: "/docs/openapi.json",
};

async function initServer(config: { app: AppConfig; swagger: SwaggerConfig }) {
    const app = express();

    app.use(compression());
    app.use(bodyParser.json({ type: "application/json" }));
    app.use(bodyParser.urlencoded({ extended: true }));

    autoroutes(app, {
        dir: "./controller",
        log: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        const processedError = ErrorProcessor.getInstance().process(err);
        res.status(processedError[0].code).send(new ErrorResponseDTO({
            errors: processedError,
            statusCode: processedError[0].code
        }));
        return;
    });

    serveSwagger();

    return app;

    async function serveSwagger() {
        const doc: OAS3Definition = swaggerDocument;
        app.use(config.swagger.url, serve, setup(doc));
        return;
    }
}


export async function startServer() {
    const config = {
        app: envConfig.get("App"),
        swagger: envConfig.get("Swagger"),
    };
    const app = await initServer(config);
    app.listen(config.app.port, () => {
        console.log(`Server is running on http://${config.app.host}:${config.app.port}`);
    });

    return app;
}
