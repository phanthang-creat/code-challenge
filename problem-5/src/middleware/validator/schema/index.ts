import { ErrorProcessor } from "@interface/error";
import { ErrorResponseDTO, Req } from "@interface/IApi";
import { NextFunction, Response } from "express";
import Joi from "joi";
import { Model } from "sequelize";

export const schemaValidator = (schema: Joi.ObjectSchema | Joi.ArraySchema) => {
	return async (req: Req<Model>, res: Response, next: NextFunction) => {
		try {
			req.body = await schema.validateAsync(req.body);
			next();
			return;
		} catch (error) {
			const validationError = error as Joi.ValidationError;
			const errorProcessed = ErrorProcessor.getInstance().process(validationError);
			res.status(errorProcessed[0].code).send(new ErrorResponseDTO({
				errors: errorProcessed,
				statusCode: errorProcessed[0].code,
			}));
			return;
		}
	};
};
