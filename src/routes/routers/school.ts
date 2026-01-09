import express from "express";
import { School } from "@/controllers/controller/school";
import { validateRequest } from "@/middlewares/zodMiddleware";
import Validators from "@/validators";

const schoolRouter = express.Router();

schoolRouter.post(
  "/",
  validateRequest(Validators.School.createSchool),
  School.createSchool
);

export default schoolRouter;
