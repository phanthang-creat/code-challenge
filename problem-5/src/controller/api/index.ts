import { ResponseDTO } from "@interface/IApi";
import { Request, Response } from "express";

export default async function healthyCheck(_req: Request, res: Response) {
	return res.send(new ResponseDTO({ data: "OK" }));
}

