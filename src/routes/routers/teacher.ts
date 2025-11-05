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
  Controllers.Teacher.teacherClassSectionMap
);
teacherRouter.post(
  "/get-teacher-class",
  Controllers.Teacher.getTeacherClassSectionMap
);

export default teacherRouter;
