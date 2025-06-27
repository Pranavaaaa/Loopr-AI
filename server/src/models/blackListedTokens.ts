import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for the BlackListToken document
interface IBlackListToken extends Document {
   token: string;
   createdAt: Date;
}

// Interface for the BlackListToken model (static methods)
interface IBlackListTokenModel extends Model<IBlackListToken> {
   // Add any static methods here if needed
}

const blackListedSchema: Schema<IBlackListToken> = new mongoose.Schema({
   token: {
      type: String,
      required: true,
      unique: true
   },
   createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400 // 24 hours in seconds
   }
});

const BlackListToken: IBlackListTokenModel = mongoose.model<IBlackListToken, IBlackListTokenModel>('BlackListToken', blackListedSchema);

export default BlackListToken;
export { IBlackListToken, IBlackListTokenModel };