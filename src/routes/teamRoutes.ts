import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createTeam, joinTeam, viewTeamMembers } from "../controllers/teamController";

const router = express.Router();

router.post("/create", protect, createTeam);
router.post("/join", protect, joinTeam);
router.get("/members", protect, viewTeamMembers);

export default router;
