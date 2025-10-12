import express from "express";
import schoolRouter from "./routers/school";
import studentRouter from "./routers/student";

const router = express.Router();

router.use("/school", schoolRouter);
router.use("/student", studentRouter);

export default router;
