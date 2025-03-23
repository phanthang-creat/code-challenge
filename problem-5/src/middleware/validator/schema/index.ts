import { ErrorProcessor } from "@interface/error";
import { ErrorResponseDTO } from "@interface/IApi";
import { NextFunction, Response, Request } from "express";
import Joi from "joi";

export const schemaValidator = (schema: Joi.ObjectSchema | Joi.ArraySchema) => {
	return async (req: Request, res: Response, next: NextFunction) => {
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
