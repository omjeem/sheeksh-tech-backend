import express from "express"
import Controllers from "../../controllers";

const sectionRouter = express.Router()

sectionRouter.post("/", Controllers.Section.create)
sectionRouter.get("/:classId", Controllers.Section.getAll)

export default sectionRouter;