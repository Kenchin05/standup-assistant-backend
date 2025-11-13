import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
  type: { type: String, default: "team" },
  teamId: { type: mongoose.Types.ObjectId, required: true },
  date: { type: String, required: true }, // e.g. "2025-11-07"
  summary: String,
  common_blockers: [String],
  suggested_collaborations: [String],
  risks: [String],
});

export default mongoose.model("Summary", summarySchema);
