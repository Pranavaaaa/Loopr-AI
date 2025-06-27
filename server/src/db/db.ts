import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = () => {
  mongoose
    .connect(process.env.DB_CONNECT as string)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.log("Error connecting to the database", err);
    });
};

export default connectDB;