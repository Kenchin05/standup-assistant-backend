import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createTeam, joinTeam, viewTeamMembers, getMyTeam} from "../controllers/teamController";

const router = express.Router();

router.post("/create", protect, createTeam);
router.post("/join", protect, joinTeam);
router.get("/members", protect, viewTeamMembers);
router.get("/me", protect, getMyTeam);

export default router;
