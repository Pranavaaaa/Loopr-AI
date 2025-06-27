import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  fullName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
  socketId?: string;
  generateAuthToken(): string;
  comparePassword(password: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  hashPassword(password: string): Promise<string>;
}

const userSchema = new mongoose.Schema<IUser>({
  fullName: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  socketId: { type: String },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: "24h",
  });
};

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password: string) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model<IUser, IUserModel>("user", userSchema);

export default userModel;