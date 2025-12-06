import Product from "./product-model.js";
import ProductService from "./product-service.js";
import ProductMessage from "./product-messages.js";
import autoBind from "../../common/utils/auto-bind.js";
import ClientResponse from "../../common/utils/client-response.js";

class ProductController {
  #service;

  constructor() {
    this.#service = new ProductService();

    autoBind(this);
    Object.freeze(this);
  }

  async filter(req, res) {
    const products = await this.#service.filter(req.query);
    return ClientResponse.success(res, products);
  }

  async import(req, res) {
    await Product.validateCreate(req.file);
    const result = await this.#service.createBulk(req.file);

    if (!result.success) {
      return ClientResponse.badRequest(res, result.message);
    }

    return ClientResponse.success(res, {
      data: result.data,
      message: ProductMessage.IMPORTED,
    });
  }
}

export default ProductController;
