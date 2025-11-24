import express from "express";
import schoolRouter from "./routers/school";
import studentRouter from "./routers/student";
import sessionRouter from "./routers/session";
import classRouter from "./routers/class";
import sectionRouter from "./routers/section";
import teacherRouter from "./routers/teacher";
import authRouter from "./routers/auth";
import { authMiddleware } from "../middlewares/authMiddleware";
import subjectRouter from "./routers/subject";
import userRouter from "./routers/user";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/school", schoolRouter);
router.use("/student", authMiddleware, studentRouter);
router.use("/session", authMiddleware, sessionRouter);
router.use("/class", authMiddleware, classRouter);
router.use("/section", authMiddleware, sectionRouter);
router.use("/teacher", authMiddleware, teacherRouter);
router.use("/subject", authMiddleware, subjectRouter)
router.use("/user", authMiddleware, userRouter)


export default router;
