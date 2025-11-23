import express from "express";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";
import { adminMiddleware } from "../../middlewares/userRolesMiddleware";

const studentRouter = express.Router();

studentRouter.post(
  "/",
  validateRequest(Validators.Student.feedStudents),
  adminMiddleware,
  Controllers.Student.feedStudents
);

studentRouter.get("/", Controllers.Student.getStudentClassData);

studentRouter.get("/sr", Controllers.Student.getLastSrNo);

studentRouter.get(
  "/class-section",
  validateRequest(Validators.Student.getClassStudent),
  Controllers.Student.getStudentClassData
);

export default studentRouter;
