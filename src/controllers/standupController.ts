import { Request, Response } from "express";
import Standup from "../models/Standup";
import Summary from "../models/Summary";
import { analyseStandup } from "../services/aiService";
import { generateTeamSummary } from "../services/aiService"; 

export const createOrUpdateStandup = async (req: any, res: any) => {
    console.log("🚀 Received /api/standup POST request");

  const { yesterday, today, blockers } = req.body;
    console.log("🧾 Standup content:", { yesterday, today, blockers });
  const todayDate = new Date().toDateString();

  let standup = await Standup.findOne({
    userId: req.user._id,
    date: { $gte: new Date(todayDate) },
  });
let isNew = false;
let hasChanged = false;

 if (standup) {
    console.log("📄 Found existing standup entry");
    if (
      standup.yesterday !== yesterday ||
      standup.today !== today ||
      standup.blockers !== blockers
    ) {
      hasChanged = true;
      standup.yesterday = yesterday;
      standup.today = today;
      standup.blockers = blockers;
    }
  } else {
    console.log("🆕 Creating new standup entry");
    isNew = true;
    standup = new Standup({
      userId: req.user._id,
      teamId: req.user.teamId,
      yesterday,
      today,
      blockers,
    });
  }

  // Trigger AI only if content changed or first creation
    const shouldReanalyse = isNew || hasChanged || !standup.aiFeedback;
  console.log("🤖 Should reanalyse?", shouldReanalyse);

  if (shouldReanalyse) {
    console.log("📡 analyseStandup() triggered...");
    const aiResult = await analyseStandup({ yesterday, today, blockers });
    standup.aiFeedback = aiResult;
  }

  await standup.save();

  res.status(201).json({ message: "Standup saved", standup });
};  

export const getTeamAIInsights = async (req: any, res: any) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Check if summary for today already exists
  const cached = await Summary.findOne({ teamId: req.user.teamId, date: today });
  if (cached) {
    console.log("Using cached team summary");
    return res.json(cached);
  }

  // If not, fetch team standups and call GPT once
  console.log("Generating new team summary...");
  const standups = await Standup.find({ teamId: req.user.teamId }).populate("userId", "name");
  const insights = await generateTeamSummary(standups);

  // Save for caching
  const saved = await Summary.create({
    teamId: req.user.teamId,
    date: today,
    ...insights,
  });

  res.json(saved);
};

export const getMyStandups = async (req: any, res: Response) => {
  const standups = await Standup.find({ userId: req.user._id }).sort({ date: -1 }).limit(30);
  res.json(standups);
};

export const getTeamStandups = async (req: any, res: Response) => {
  const standups = await Standup.find({ teamId: req.user.teamId }).populate("userId", "name");
  res.json(standups);
};

// PUT /api/standup/update
export const updateTodayStandup = async (req: any, res: Response) => {
  const { yesterday, today, blockers } = req.body;
  const userId = req.user.id;

  // Find standup for today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const standup = await Standup.findOne({
    userId,
    date: { $gte: startOfDay },
  });

  if (!standup) {
    return res.status(404).json({ message: "No standup found for today" });
  }

  // Prevent editing if it's past midnight
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  if (now > endOfDay) {
    return res.status(400).json({ message: "Can't edit after the day ends" });
  }

  standup.yesterday = yesterday || standup.yesterday;
  standup.today = today || standup.today;
  standup.blockers = blockers || standup.blockers;

  await standup.save();

  res.json({ message: "Standup updated successfully", standup });
};

// DELETE /api/standup/:id
export const deleteStandup = async (req: any, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;

  const standup = await Standup.findById(id);
  if (!standup) return res.status(404).json({ message: "Standup not found" });

  if (standup.userId.toString() !== userId)
    return res.status(403).json({ message: "Not authorized to delete this standup" });

  await standup.deleteOne();
  res.json({ message: "Standup deleted successfully" });
};
