import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import BlackListedTokensSchema from "../models/blackListedTokens.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const isBlackListed = await BlackListedTokensSchema.findOne({ token });

  if (isBlackListed) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };
    const user = await userModel.findById(decoded._id);
    req.user = user || undefined;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};