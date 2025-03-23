import { Req, ResponseDTO } from "@interface/IApi";
// import queryModifier from "@middleware/query-modifier";
// import { schemaValidator } from "@middleware/validator/schema";
// import createProductDto from "@middleware/validator/schema/product/create-product.dto";
import { Product } from "@repository/model/product";
import { ProductService } from "@service/product";
import { NextFunction, Response } from "express";
import controllerById from "./{product_id}";
export interface IProductController {
	get: (req: Req<Product>, res: Response, next: NextFunction) => void;
	post: (req: Req<Product>, res: Response, next: NextFunction) => void;
	getById: (req: Req<Product & { product_id: string }>, res: Response, next: NextFunction) => void;
	put: (req: Req<Product & { product_id: string }>, res: Response, next: NextFunction) => void;
	delete: (req: Req<Product & { product_id: string }>, res: Response, next: NextFunction) => void;
}

export class ProductController implements IProductController {
	private static instance: ProductController;

	private constructor() {}

	static getInstance() {
		if (!ProductController.instance) {
			ProductController.instance = new ProductController();
		}
		return ProductController.instance;
	}

	async get(req: Req<Product>, res: Response, next: NextFunction) {
		try {
			const options = {
				where: {}, // Ensure where property is present
				...(req.payload || {})
			};
			const products = await ProductService.getInstance().getAll(options);
			return res.send(new ResponseDTO({ data: products }));
			
		} catch (error) {
			return next(error);
		}
	}

	async post(req: Req<Product>, res: Response, next: NextFunction) {
		try {
			const product = await ProductService.getInstance().post({
				...req.body,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			return res.send(new ResponseDTO({ data: product }));
			
		} catch (error) {
			return next(error);
		}
	}

	async getById(req: Req<Product & { product_id: string }>, res: Response, next: NextFunction) {
		return controllerById().get(req, res, next);
	}

	async put(req: Req<Product>, res: Response, next: NextFunction) {
		return controllerById().put(req, res, next);
	}

	async delete(req: Req<Product>, res: Response, next: NextFunction) {
		return controllerById().destroy(req, res, next);
	}
}