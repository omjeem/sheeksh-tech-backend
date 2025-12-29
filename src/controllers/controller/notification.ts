import { Request, response, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import Services from "../../services";

export class Notification {
  static createCategory = async (req: Request, res: Response) => {
    try {
      const { userId, schoolId } = req.user;
      const { categories } = req.body;
      const categoryData = await Services.Notification.createCategory({
        userId,
        schoolId,
        categories,
      });
      return successResponse(
        res,
        "Categories created Successfully",
        categoryData
      );
    } catch (error: any) {
      console.log("Error in creating the category", error);
      return errorResponse(res, error.message || error);
    }
  };

  static getAllCategpries = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const categoryData = await Services.Notification.getAllCategories(
        schoolId
      );
      return successResponse(
        res,
        "Categories data fetched Successfully",
        categoryData
      );
    } catch (error: any) {
      console.log("Error in Getting the category data", error);
      return errorResponse(res, error.message || error);
    }
  };
}
