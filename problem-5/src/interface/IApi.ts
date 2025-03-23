import { IncomingHttpHeaders } from "http";
import { Request, Response as ExpressResponse } from "express";
import { SequelizeApiPaginatePayload } from "@repository/database/type";
import { Model } from "sequelize";
import { ErrorProcessor, IViolations, ViolationDTO } from "./error";

// Default messages
const DEFAULT_SUCCESS_MESSAGE = {
	en: "Success",
	vi: "Thành công",
};

const DEFAULT_ERROR_MESSAGE = {
	en: "An error occurred",
	vi: "Đã có lỗi xảy ra",
};

export interface Req<
	ModelInterface extends Model,
	ModelMutationInterface = ModelInterface
> extends Request {
	payload?: SequelizeApiPaginatePayload<ModelInterface>;
	headers: IncomingHttpHeaders;
	body: ModelMutationInterface;
	query: Record<string, string>;
	[key: string]: unknown;
}

export interface Res extends ExpressResponse {
	error(error: ErrorResponseDTO): void;
	ok<T>(data: T, message?: Record<string, string>, statusCode?: number): void;
}

export interface OkParams<T = unknown> {
	data: T;
	message?: Record<string, string>;
	statusCode?: number;
	violations?: unknown[];
}

export class ResponseDTO<T = unknown> {
	message: Record<string, string>;
	data?: T;
	statusCode: number;
	violations: unknown[];
	timeStamp: string;

	constructor({
		data,
		message = DEFAULT_SUCCESS_MESSAGE,
		statusCode = 200,
		violations = [],
	}: OkParams<T>) {
		this.message = message;
		this.data = data;
		this.statusCode = statusCode;
		this.violations = violations;
		this.timeStamp = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
	}

	public static create<T>(data: T, message?: Record<string, string>, statusCode = 200): ResponseDTO<T> {
		return new ResponseDTO({ data, message, statusCode });
	}
}

export class ErrorStatusParams {
	message?: Record<string, string>;
	statusCode: number;
	errors: IViolations | ViolationDTO[] | undefined;

	constructor(message: Record<string, string>, statusCode: number, errors?: ViolationDTO[]) {
		this.message = message;
		this.statusCode = statusCode;
		this.errors = errors;
	}
}

export class ErrorResponseDTO extends ResponseDTO<null> {
	constructor({
		message = DEFAULT_ERROR_MESSAGE,
		statusCode,
		errors = [],
	}: ErrorStatusParams) {
		super({
			data: null,
			message,
			statusCode,
			violations: ErrorProcessor.getInstance().process(errors),
		});
	}

	public static createError(
		errors: ViolationDTO[],
		options?: { statusCode?: number; message?: Record<string, string> },
	): ErrorResponseDTO;
	public static createError(
		error: ViolationDTO,
		options?: { statusCode?: number; message?: Record<string, string> },
	): ErrorResponseDTO;
	public static createError(
		errors: ViolationDTO | ViolationDTO[],
		options?: { statusCode?: number; message?: Record<string, string> },
	): ErrorResponseDTO {
		const { statusCode = 500, message = DEFAULT_ERROR_MESSAGE } = options || {};
		return new ErrorResponseDTO({
			message,
			statusCode,
			errors: Array.isArray(errors) ? errors : [errors],
		});
	}
}
