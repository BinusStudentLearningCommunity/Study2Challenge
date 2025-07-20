import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string; 
  firstName: string; 
  lastName: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true }, 
  lastName: { type: String, required: true}
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
