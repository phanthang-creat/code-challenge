import { ValidationError as JoiValidationError } from "joi";
import { IErrorHandler } from ".";
import { GenericError } from "./GenericError";
import { IViolations } from "./IViolation";
import { joiMessages } from "./message/index";

/**
 * End of Sequelize Error Handler
 */

// Validation Error Handler
export class JoiValidateErrorHandler implements IErrorHandler {
	canHandle(error: unknown): boolean {
		return (
			error instanceof JoiValidationError ||
			(Array.isArray(error) && error.every((e) => e instanceof JoiValidationError))
		);
	}

	errorMessage(error: JoiValidationError) {
		if (error.details[0].type === "any.custom") {
			return { fields: error.details[0].context?.["fields"] ?? [] };
		} else
			return {
				fields: error.details.map((err) => {
					return {
						field: err.path.join("."),
						message: joiMessages(err?.context?.label ?? "any", err.type, err.context),
					};
				}),
			};
	}

	handle(error: JoiValidationError | JoiValidationError[]): IViolations {
		const createViolation = (err: JoiValidationError) => ({
			message: {
				en: "Invalid value",
				vi: "Giá trị không hợp lệ",
			},
			type: "JoiValidationError",
			code: 422,
			additionalData: this.errorMessage(err),
		});

		return Array.isArray(error) ? error.map(createViolation) : [createViolation(error)];
	}
}

// Fallback Handler
export class GenericErrorHandler implements IErrorHandler {
	 
	canHandle(): boolean {
		return true;
	}

	handle(error: GenericError | GenericError[] | null): IViolations {
		// Handle single GenericError
		if (error instanceof GenericError) {
			return [
				{
					message: error.message,
					type: error.type,
					code: error.code,
					additionalData: error.additionalData,
				},
			];
		}

		// Handle array of GenericErrors
		if (Array.isArray(error)) {
			return error.map((e) => ({
				message: e.message,
				type: e.type,
				code: e.code,
				additionalData: e.additionalData,
			}));
		}

		return [
			{
				message: {
					en: "Internal server error",
					vi: "Lỗi máy chủ",
				},
				type: "InternalServerError",
				code: 500,
			},
		];
	}
}
