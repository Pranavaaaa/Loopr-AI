import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes";
import transactionRoutes from "./routes/transaction.routes";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello From Server!");
});

app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
