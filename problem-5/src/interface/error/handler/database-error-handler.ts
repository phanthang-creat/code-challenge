import { IViolations } from "../IViolation";
import { dataErrorMessagesHandler } from "../message";
import { IErrorHandler } from "..";
import {
	BaseError,
	ForeignKeyConstraintError,
	UniqueConstraintError,
	ValidationError,
} from "sequelize/lib/errors/index";

export interface DatabaseErrorAdditionalData {
	errorFields?: string[];
}

/**
 * Sequelize Error Handler
 */
export class DatabaseErrorHandler implements IErrorHandler {
	canHandle(error: unknown): boolean {
		return error instanceof ValidationError || error instanceof ForeignKeyConstraintError || error instanceof BaseError;
	}

	handle(error: unknown, additionalData?: DatabaseErrorAdditionalData): IViolations {
		if (error instanceof UniqueConstraintError) {
			return [
				{
					message: {
						en: `Unique constraint error`,
						vi: `Lỗi ràng buộc duy nhất`,
					},
					type: "SequelizeUniqueConstraintError",
					code: 400,
					additionalData: {
						fields: error.errors.map((err) => ({
							field: err.path,
							message: dataErrorMessagesHandler(error, {
								...additionalData,
								errorFields: [err.path ?? ''],
							}),
						})),
					},
				},
			];
		}

		if (error instanceof ValidationError) {
			return [
				{
					message: {
						en: "Database validation error",
						vi: "Lỗi kiểm tra cơ sở dữ liệu",
					},
					type: "SequelizeValidationError",
					code: 400,
					additionalData: {
						fields: error.errors.map((e) => ({
							field: e.path,
							message: dataErrorMessagesHandler(e, additionalData),
						})),
					},
				},
			];
		}

		if (error instanceof ForeignKeyConstraintError) {
			const fields = error?.fields ? Object.keys(error?.fields) : getFieldsFromDetails(error.original?.["detail"]);
			return [
				{
					message: {
						en: "Foreign key constraint error",
						vi: "Lỗi ràng buộc khóa ngoại",
					},
					type: "SequelizeForeignKeyConstraintError",
					code: 400,
					additionalData: {
						fields: fields.map((key) => ({
							field: key,
							message: dataErrorMessagesHandler(error, {
								...additionalData,
								errorFields: [key],
							}),
						})),
					},
				},
			];

			function getFieldsFromDetails(detail: string) {
				if (!detail) return [];
				const matches = detail.match(/Key \((.*?)\)=\((.*?)\) is not present in table "(.*?)"./);
				if (!matches) return [];
				return matches[1].split(", ");
			}
		}

		if (error instanceof BaseError) {
			return [
				{
					message: {
						en: "Database error",
						vi: "Lỗi cơ sở dữ liệu",
					},
					type: "SequelizeBaseError",
					code: 400,
					additionalData: {
						message: dataErrorMessagesHandler(error, additionalData),
						// sql: error.cause,
					},
				},
			];
		}

		throw new Error("Unhandled database error type");
	}
}
