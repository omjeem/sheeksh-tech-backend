import express from "express"
import Controllers from "../../controllers";

const sessionRouter = express.Router()

sessionRouter.post("/", Controllers.Session.create)
sessionRouter.get("/", Controllers.Session.getAll)

export default sessionRouter;