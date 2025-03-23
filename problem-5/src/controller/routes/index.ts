import healthyCheck from "@controller/api";
import { Router } from "express";
import productRouter from "./product";

const router = Router();

router.get("/", (req, res, next) => {
  healthyCheck(req, res).catch(next);
});

router.use("/product", productRouter);

export default router;