import { Router } from "express";
import createProductRoutes from "./product/product-routes.js";

function registerRoutes() {
  const mainRouter = Router();

  mainRouter.use("/products", createProductRoutes());

  return mainRouter;
}

export default registerRoutes;
