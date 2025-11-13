import mongoose, { Schema, Document } from "mongoose";

export interface IStandup extends Document {
  userId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  date: Date;
  yesterday: string;
  today: string;
  blockers: string;
  aiFeedback?: {
    key_tasks: string[];
    tone: string;
    vague_score: number;
    suggestion: string;
  };
}

const standupSchema = new Schema<IStandup>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    date: { type: Date, default: Date.now },
    yesterday: String,
    today: String,
    blockers: String,
    aiFeedback: {
      key_tasks: [String],
      tone: String,
      vague_score: Number,
      suggestion: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IStandup>("Standup", standupSchema);
