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

  static createTemplate = async (req: Request, res: Response) => {
    try {
      const { schoolId, userId } = req.user;
      const { name, payload, categoryId } = req.body;
      const [templateData] = await Services.Notification.createTemplate({
        schoolId,
        userId,
        name,
        payload,
        categoryId,
      });
      return successResponse(
        res,
        "Template created Successfully",
        templateData
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getTemplateByTemplateId = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const { templateId } = req.params;
      const templateData = await Services.Notification.getAllTemplate(
        schoolId,
        templateId
      );
      return successResponse(
        res,
        "Template Fetched Successfully",
        templateData
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getAllTemplate = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const templateData = await Services.Notification.getAllTemplate(schoolId);
      return successResponse(
        res,
        "Template Fetched Successfully",
        templateData
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static getTemplateByCategory = async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.user;
      const { categoryId } = req.params;
      const templateData = await Services.Notification.getTemplateByCategory({
        schoolId,
        categoryId: String(categoryId),
      });
      return successResponse(
        res,
        "Template Fetched Successfully",
        templateData
      );
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };
}
