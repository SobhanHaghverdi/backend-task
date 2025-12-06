import { Router } from "express";
import createProductRoutes from "./product/product-routes.js";
import createCategoryRoutes from "./category/category-routes.js";

function registerRoutes() {
  const mainRouter = Router();

  mainRouter.use("/products", createProductRoutes());
  mainRouter.use("/categories", createCategoryRoutes());

  return mainRouter;
}

export default registerRoutes;
