import Controllers from "@/controllers";
import { validateRequest } from "@/middlewares/zodMiddleware";
import Validators from "@/validators";
import express from "express";

const systemAdminRouter = express.Router();

systemAdminRouter.put(
  "/profile",
  validateRequest(Validators.SystemAdmin.profileUpdate),
  Controllers.SystemAdmin.updatePassword
);

export default systemAdminRouter;
