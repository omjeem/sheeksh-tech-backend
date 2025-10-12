import express from "express";
import schoolRouter from "./routers/school";
import studentRouter from "./routers/student";
import sessionRouter from "./routers/session";

const router = express.Router();

router.use("/school", schoolRouter);
router.use("/student", studentRouter);
router.use("/session", sessionRouter)

export default router;
