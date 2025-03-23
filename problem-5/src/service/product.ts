import { ProductProvider } from "@provider/product";

export class ProductService extends ProductProvider {    
    public static instance: ProductService;
    public static getInstance(): ProductService {
        if (!this.instance) {
            this.instance = new ProductService();
        }
        return this.instance;
    }
    
    constructor() {
        super();
    }
}