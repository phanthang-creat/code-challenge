import { ProductController } from "@controller/api/product";
import { Req } from "@interface/IApi";
import queryModifier from "@middleware/query-modifier";
import { schemaValidator } from "@middleware/validator/schema";
import createProductDto from "@middleware/validator/schema/product/create-product.dto";
import { validateId } from "@middleware/validator/uuid";
import { Product } from "@repository/model/product";
import { Router } from "express";

const router = Router();

const productController = ProductController.getInstance();

router.get("/", queryModifier<Product>(), (req, res, next) => {
  productController.get(req as unknown as Req<Product>, res, next);
});
router.post("/", schemaValidator(createProductDto), (req, res, next) => {
  productController.post(req as Req<Product>, res, next);
});

router.get("/:product_id", validateId("product_id"), (req, res, next) => {
  productController.getById(
    req as unknown as Req<Product & { product_id: string }>,
    res,
    next
  );
});

router.put("/:product_id", validateId("product_id"), (req, res, next) => {
  productController.put(req as unknown as Req<Product>, res, next);
});

router.delete("/:product_id", validateId("product_id"), (req, res, next) => {
  productController.delete(req as unknown as Req<Product>, res, next);
});

export default router;
