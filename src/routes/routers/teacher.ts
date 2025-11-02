import express from "express";
import Controllers from "../../controllers";

const teacherRouter = express.Router();

teacherRouter.post("/", Controllers.Teacher.create)
teacherRouter.get("/", Controllers.Teacher.getAllTeachers)
teacherRouter.post("/teacher-class", Controllers.Teacher.teacherClassSectionMap)
teacherRouter.post("/get-teacher-class", Controllers.Teacher.getTeacherClassSectionMap)


export default teacherRouter;