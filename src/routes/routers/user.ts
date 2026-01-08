import express from "express";
import Controllers from "../../controllers";
import { validateRequest } from "../../middlewares/zodMiddleware";
import Validators from "../../validators";

const userRouter = express.Router();

userRouter.get("/", Controllers.User.getUserDetails);
userRouter.put(
  "/search",
  validateRequest(Validators.User.search),
  Controllers.User.userSearch
);

export default userRouter;
