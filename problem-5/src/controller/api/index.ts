import { ResponseDTO } from "@interface/IApi";
import { Request, Response } from "express";
import { Resource } from "express-automatic-routes";

export default (): Resource => {
	async function healthyCheck(_req: Request, res: Response) {
		return res.send(new ResponseDTO({ data: "OK" }));
	}

	return {
		middleware: [],
		get: {
			middleware: [],
			handler: async (request: Request, response: Response) => {
				await healthyCheck(request, response);
			},
		},
	};
};
