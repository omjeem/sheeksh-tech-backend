import express from "express"
import { subjectRelations } from "../../config/schema"
import Controllers from "../../controllers";

const subjectRouter = express.Router()

subjectRouter.post("/", Controllers.Subject.create)
subjectRouter.get("/", Controllers.Subject.get)


export default subjectRouter;