import express from "express";
import schoolRouter from "./routers/school";
import studentRouter from "./routers/student";
import sessionRouter from "./routers/session";
import classRouter from "./routers/class";
import sectionRouter from "./routers/section";
import teacherRouter from "./routers/teacher";

const router = express.Router();

router.use("/school", schoolRouter);
router.use("/student", studentRouter);
router.use("/session", sessionRouter);
router.use("/class", classRouter);
router.use("/section", sectionRouter);
router.use("/teacher", teacherRouter);

export default router;
