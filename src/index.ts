import express, { Request, Response } from "express";
import cors from "cors";
import { envConfigs } from "./config/envConfig";
import { connectToDatabase } from "@/db";
import router from "./routes";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());
app.use(cors());

const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please slow down.",
  },
});

app.use(globalRateLimiter);

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Welcome to Shiksha Tech Api",
  });
});

app.use("/api", router);

app.listen(envConfigs.port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${envConfigs.port}`);
  connectToDatabase();
});
