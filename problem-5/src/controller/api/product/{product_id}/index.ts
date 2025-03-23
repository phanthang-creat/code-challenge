import { Req, ResponseDTO } from "@interface/IApi";
// import { schemaValidator } from "@middleware/validator/schema";
// import updateProductDto from "@middleware/validator/schema/product/update-product.dto";
// import { validateId } from "@middleware/validator/uuid";
import { Product } from "@repository/model/product";
import { ProductService } from "@service/product";
import { Response, NextFunction } from "express";
// import { Resource } from "express-automatic-routes";

export default () => {
    const provider = {
        product: ProductService.getInstance(),
    };

    async function get(req: Req<Product>, res: Response, next: NextFunction) {
        try {
            const products = await provider.product.getById({ id: req.params["product_id"] });
            return res.send(new ResponseDTO({ data: products }));
        } catch (error) {
            return next(error);
        }
    }

    async function put(req: Req<Product>, res: Response, next: NextFunction) {
        try {
            const product = await provider.product.put(
                req.params["product_id"],
                {
                    ...req.body,
                    updatedAt: new Date(),
                });
            return res.send(new ResponseDTO({ data: product }));
        } catch (error) {
            return next(error);
        }
    }

    async function destroy(req: Req<Product>, res: Response, next: NextFunction) {
        try {
            const product = await provider.product.delete(req.params["product_id"]);
            return res.send(new ResponseDTO({ data: product }));
        } catch (error) {
            return next(error);
        }
    }

    return {
        get,
        put,
        destroy,
    };
};
