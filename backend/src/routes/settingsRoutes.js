import { Router } from "express";
import {
  getAdminSettings,
  getPublicSettings,
  updateUPISettings
} from "../controllers/settingsController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/public", getPublicSettings);
router.get("/", getAdminSettings);
router.put("/", upload.single("qrImage"), updateUPISettings);
router.put("/upi", upload.single("qrImage"), updateUPISettings);

export default router;
