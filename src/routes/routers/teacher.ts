import express from "express";
import Controllers from "../../controllers";

const teacherRouter = express.Router();

teacherRouter.post("/", Controllers.Teacher.create)
teacherRouter.get("/", Controllers.Teacher.getAllTeachers)

export default teacherRouter;