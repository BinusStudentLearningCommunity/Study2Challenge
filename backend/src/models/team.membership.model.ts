import mongoose, { Document, Schema } from "mongoose";

export interface ITeamMembership extends Document {
    teamId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
}

const teamMembershipSchema = new Schema<ITeamMembership>({
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

teamMembershipSchema.index({ teamId: 1, userId: 1 }, { unique: true });

const TeamMembership = mongoose.model<ITeamMembership>('TeamMembership', teamMembershipSchema);
export default TeamMembership;