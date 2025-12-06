import CategoryService from "./category-service.js";
import autoBind from "../../common/utils/auto-bind.js";

class CategoryController {
  #service;

  constructor() {
    this.#service = new CategoryService();

    autoBind(this);
    Object.freeze(this);
  }
}

export default CategoryController;
