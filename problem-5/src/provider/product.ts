import { Product } from "@repository/model/product";
import BaseProvider from ".";
import db from "@repository/database";

export class ProductProvider extends BaseProvider<Product> {
    constructor() {
        super("Product", db);
    }
}