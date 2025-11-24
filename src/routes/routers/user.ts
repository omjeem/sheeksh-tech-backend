import express from "express";
import Controllers from "../../controllers";

const userRouter = express.Router();

userRouter.get("/", Controllers.User.getUserDetails);

export default userRouter;
