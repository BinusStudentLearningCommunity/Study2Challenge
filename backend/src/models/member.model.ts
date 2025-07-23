import mongoose, {Document, Schema} from "mongoose";

export interface IMember extends Document{
    teamId: mongoose.Types.ObjectId,
    fullName?: string,
    email: string,
    dateOfBirth?: Date,
    gender?: string,
    whatsappNumber?: string,
    institution?: string,
    idCardUrl?: string,
    twibbonLink?: string,
    role?: string
}

const memberSchema = new Schema<IMember>({
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true},
    fullName: { type: String},
    email: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String },
    whatsappNumber: { type: String },
    institution: { type: String },
    idCardUrl: { type: String },
    twibbonLink: { type: String },
    role: { type: String }
})

memberSchema.index({ teamId: 1, email: 1 }, { unique: true });

const Member = mongoose.model<IMember>('Member', memberSchema);
export default Member;