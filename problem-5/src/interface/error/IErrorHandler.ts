import { IViolations } from "./IViolation";

// Base Error Handler Interface
export interface IErrorHandler {
	canHandle(error: unknown): boolean;
	handle(error: unknown, additionalData?: unknown): IViolations;
}
