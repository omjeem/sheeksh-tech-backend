import express from "express";
import Controllers from "@/controllers";
import { validateRequest } from "@/middlewares/zodMiddleware";
import Validators from "@/validators";

const userRouter = express.Router();

userRouter.get("/", Controllers.User.getUserDetails);
userRouter.put(
  "/search",
  validateRequest(Validators.User.search),
  Controllers.User.userSearch
);

userRouter.post(
  "/guardian-map",
  validateRequest(Validators.User.userGuardianRelationMap),
  Controllers.User.userGuardianRelationMap
);

userRouter.post(
  "/guardian",
  validateRequest(Validators.User.createGuardian),
  Controllers.User.createGuardian
);

userRouter.get(
  "/guardian/:userId",
  validateRequest(Validators.User.getAllUserGuardians),
  Controllers.User.getAllUserGuardians
);

export default userRouter;
