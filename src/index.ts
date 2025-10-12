import express, { Request, Response } from "express";
import cors from "cors";
import { envConfigs } from "./config/envConfig";
import { connectToDatabase, db } from "./config/db";
import router from "./routes";
import { sql } from "drizzle-orm";
import { errorResponse, successResponse } from "./config/response";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Hello world",
  });
});

app.delete("/flush", async (req, res) => {
  try {
    // if (process.env.NODE_ENV === "production") {
    //   return res.status(403).json({ error: "Forbidden in production" });
    // }
    await db.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);

    return successResponse(res, 200, "All data flushed successfully.");
  } catch (error: any) {
    console.error("Error while flushing data:", error);
    return errorResponse(res, 400, error.message || error);
  }
});

app.use("/api", router);

app.listen(envConfigs.port, () => {
  console.log(`Server is running on http://localhost:${envConfigs.port}`);
  connectToDatabase();
});
