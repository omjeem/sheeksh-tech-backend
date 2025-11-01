import express from "express";
import Controllers from "../../controllers";

const classRouter = express.Router();

classRouter.post("/", Controllers.Class.create);
classRouter.get("/", Controllers.Class.getAll);

export default classRouter;
