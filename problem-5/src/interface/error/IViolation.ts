import clc from "cli-color";
import { JoiValidateErrorHandler, GenericErrorHandler } from "./ViolationImpl";
import { IErrorHandler } from ".";
import { DatabaseErrorHandler } from "./handler/database-error-handler";

// Interface for Violations
export interface IViolation {
	message: {
		[key: string]: string;
	};
	type: string;
	code: number;
	additionalData?: unknown;
}

export class ViolationDTO implements IViolation {
	code: number;
	message: {
		[key: string]: string;
	};
	action?: string | null;
	additionalData?: Record<string, unknown> | null;
	type: string;

	constructor(
		code: number,
		message: {
			[key: string]: string;
		},
		type: string,
		options?: { action?: string; additionalData?: Record<string, unknown> },
	) {
		const { action, additionalData } = options || {};
		this.code = code;
		this.message = message;
		this.type = type;
		this.action = action;
		this.additionalData = additionalData;
	}
}

export type IViolations = IViolation[];

// Error Processor Factory
export class ErrorProcessor {
	private static instance: ErrorProcessor;
	private handlers: IErrorHandler[];

	private constructor() {
		this.handlers = [
			new JoiValidateErrorHandler(),
			new DatabaseErrorHandler(), // Sequelize error handler
			new GenericErrorHandler(), // Fallback handler
		];
	}

	public static getInstance(): ErrorProcessor {
		if (!ErrorProcessor.instance) {
			ErrorProcessor.instance = new ErrorProcessor();
		}
		return ErrorProcessor.instance;
	}

	process(error: unknown, additionalData?: unknown): IViolations {
		console.log(clc.redBright("ErrorProcessor.process -> error: "), error);
		const handler = this.handlers.find((h) => h.canHandle(error));
		return handler!.handle(error, additionalData);
	}
}
