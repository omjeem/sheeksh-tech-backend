import express from "express";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";

const studentRouter = express.Router();

studentRouter.post(
  "/",
  validateRequest(Validators.Student.feedStudents),
  Controllers.Student.feedStudents
);

export default studentRouter;
