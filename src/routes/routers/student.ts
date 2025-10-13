import express from "express";
import Controllers from "../../controllers";

const studentRouter = express.Router();

studentRouter.post("/", Controllers.Student.feedStudents);

export default studentRouter;