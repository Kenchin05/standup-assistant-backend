import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createOrUpdateStandup, getMyStandups, getTeamStandups, getTeamAIInsights, updateTodayStandup, deleteStandup } from "../controllers/standupController";

const router = express.Router();

router.post("/", protect, createOrUpdateStandup);
router.get("/me", protect, getMyStandups);
router.get("/team", protect, getTeamStandups);
router.get("/team/insights", protect, getTeamAIInsights);
router.put("/update", protect, updateTodayStandup);
router.delete("/:id", protect, deleteStandup);



export default router;
