import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  code: string;
  members: mongoose.Types.ObjectId[];
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model<ITeam>("Team", teamSchema);
