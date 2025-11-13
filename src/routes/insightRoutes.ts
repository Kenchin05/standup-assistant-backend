import express from "express";
import { getInsights } from "../controllers/insightController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getInsights);

export default router;
