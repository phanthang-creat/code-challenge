import type { Sequelize } from "sequelize";
import { Product as _Product } from "./product";
import type { ProductAttributes, ProductCreationAttributes } from "./product";

export {
  _Product as Product,
};

export type {
  ProductAttributes,
  ProductCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Product = _Product.initModel(sequelize);


  return {
    Product: Product,
  };
}
