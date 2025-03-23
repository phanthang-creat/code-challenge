import { Req, ResponseDTO } from "@interface/IApi";
import queryModifier from "@middleware/query-modifier";
import { schemaValidator } from "@middleware/validator/schema";
import createProductDto from "@middleware/validator/schema/product/create-product.dto";
import { Product } from "@repository/model/product";
import { ProductService } from "@service/product";
import { NextFunction, Request, Response } from "express";
// import { Resource } from "express-automatic-routes";

export default () => {
    const provider = {
        product: ProductService.getInstance(),
    };

	async function get(req: Req<Product>, res: Response, next: NextFunction) {
		try {
			const options = {
				where: {}, // Ensure where property is present
				...(req.payload || {})
			};
			const products = await provider.product.getAll(options);
			return res.send(new ResponseDTO({ data: products }));
			
		} catch (error) {
			return next(error);
		}
	}

	async function post(req: Req<Product>, res: Response, next: NextFunction) {
		try {
			const product = await provider.product.post({
				...req.body,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			return res.send(new ResponseDTO({ data: product }));
			
		} catch (error) {
			return next(error);
		}
	}

	return {
		middleware: [queryModifier<Product>()],
		get: {
			middleware: [],
			handler: async (request: Request, response: Response, next: NextFunction) => {
				await get(request as Req<Product>, response, next);
			},
		},
		post: {
			middleware: [schemaValidator(createProductDto)],
			handler: async (request: Request, response: Response, next: NextFunction) => {
				await post(request as Req<Product>, response, next);
			},
		}
	};
};
