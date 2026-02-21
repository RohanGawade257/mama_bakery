import { Router } from "express";
import { uploadImage } from "../controllers/uploadController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/", upload.single("image"), uploadImage);
router.post("/image", upload.single("image"), uploadImage);

export default router;
