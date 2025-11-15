import express from "express";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";

const teacherRouter = express.Router();

teacherRouter.post(
  "/",
  validateRequest(Validators.Teacher.create),
  Controllers.Teacher.create
);
teacherRouter.get("/", Controllers.Teacher.getAllTeachers);
teacherRouter.post(
  "/teacher-class",
  validateRequest(Validators.Teacher.teacherClassSectionMap),
  Controllers.Teacher.teacherClassSectionMap
);
teacherRouter.get(
  "/teacher-class",
  validateRequest(Validators.Teacher.getTeacherClassSectionMap),
  Controllers.Teacher.getTeacherClassSectionMap
);

export default teacherRouter;
