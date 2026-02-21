import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

router.get("/", getAllOrders);
router.put("/:id", updateOrder);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/payment", updatePaymentStatus);

export default router;
