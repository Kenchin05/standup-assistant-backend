import { Request, Response } from "express";
import Team from "../models/Team";
import User from "../models/User";
import { nanoid } from "nanoid"
// Create team
export const createTeam = async (req: any, res: Response) => {
  const { name } = req.body;
  const code = nanoid(6);
  const team = await Team.create({ name, code, members: [req.user._id] });
  req.user.teamId = team._id;
  await req.user.save();
  res.status(201).json(team);
};

// Join team
export const joinTeam = async (req: any, res: Response) => {
  const { code, name } = req.body;
let team;

if (code) {
  team = await Team.findOne({ code: code });
} else if (name) {
  team = await Team.findOne({ name: new RegExp(`^${name}$`, "i") }); // case-insensitive
}

if (!team) return res.status(404).json({ message: "Team not found" });

  if (team.members.some((m) => m.equals(req.user._id))) {
  return res.status(400).json({ message: "Already a member" });
}

  team.members.push(req.user._id);
  await team.save();

  req.user.teamId = team._id;
  await req.user.save();

  res.json({ message: "Joined team", team });
};

// View members
export const viewTeamMembers = async (req: any, res: Response) => {
  const team = await Team.findById(req.user.teamId).populate("members", "name email");
  if (!team) return res.status(404).json({ message: "Team not found" });
  res.json(team.members);
};
