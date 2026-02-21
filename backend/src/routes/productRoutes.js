import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listCategories,
  listProducts,
  updateProduct
} from "../controllers/productController.js";

const router = Router();

router.get("/", listProducts);
router.get("/categories/list", listCategories);
router.get("/:id", getProductById);

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
