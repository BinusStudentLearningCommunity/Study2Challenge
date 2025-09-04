import mongoose from "mongoose";

const emailBlastSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isEmailSent: {
    type: Boolean,
    default: false,
  },
});

export const EmailBlast = mongoose.model("EmailBlast", emailBlastSchema);
