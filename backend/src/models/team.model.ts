import mongoose, { Document, Schema } from "mongoose";

export interface ITeam extends Document {
  teamCode: string;
  teamName: string;
  paymentProofUrl?: string;
  isPay: boolean;
  isLock: boolean;
  isQualified: boolean;
  members: mongoose.Types.ObjectId[];
}

const teamSchema = new Schema<ITeam>({
  teamCode: { type: String, required: true, unique: true },
  teamName: { type: String, required: true },
  paymentProofUrl: { type: String },
  isPay: { type: Boolean, default: false },
  isLock: { type: Boolean, default: false },
  isQualified: { type: Boolean, default: false },
  members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
});

const Team = mongoose.model<ITeam>("Team", teamSchema);
export default Team;
