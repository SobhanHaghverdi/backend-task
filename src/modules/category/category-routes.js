import { Router } from "express";
import CategoryController from "./category-controller.js";

function createCategoryRoutes(controller = new CategoryController()) {
  const router = Router();
  return router;
}

export default createCategoryRoutes;
