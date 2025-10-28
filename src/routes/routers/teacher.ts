import express from "express";
import Controllers from "../../controllers";

const teacherRouter = express.Router();

teacherRouter.post("/", Controllers.Teacher.create)

export default teacherRouter;