import { Request, NextFunction, Response } from "express";
import { validate as uuidValidate } from "uuid";

/**
 *
 * @param args
 * @returns
 * @description
 * Validate the id of the request
 * @example
 * validateId("id") => validate the id of the request
 * validateId("id", "userId") => validate the id and userId of the request
 */
export function validateId(...args: string[]) {
	if (args.length === 0) args.push("id");
	return (req: Request, res: Response, next: NextFunction) => {
		for (const key of args) if (!uuidValidate(req.params[key])) return res.send({ message: "Invalid id" });
		next();
        return;
	};
}