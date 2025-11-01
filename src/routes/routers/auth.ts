import express from "express"
import Controllers from "../../controllers";

const authRouter = express.Router()

authRouter.post("/login", Controllers.Auth.login)

export default authRouter;