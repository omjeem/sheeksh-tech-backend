import express from "express";
import { School } from "../../controllers/controller/school";

const schoolRouter = express.Router();

schoolRouter.post("/", School.createSchool);

export default schoolRouter;
