import { Router } from "express";
import uploader from "../../common/utils/multer.js";
import ProductController from "./product-controller.js";

function createProductRoutes(controller = new ProductController()) {
  const router = Router();

  // GET routes
  router.get("/", controller.filter);

  // POST
  router.post("/import", uploader.single("excelFile"), controller.import);

  return router;
}

export default createProductRoutes;
