import { Request, Response } from "express";
import { errorResponse, successResponse } from "@/config/response";
import Services from "@/services";

export class Subject {
  static create = async (req: Request, res: Response) => {
    try {
      const schoolId = req.user.schoolId;
      const { name } = req.body;
      const data = await Services.Subject.create(name, schoolId)
      return successResponse(res, "Subject created Successfully!", data)
    } catch (error: any) {
      return errorResponse(res, error.message || error);
    }
  };

  static get = async (req: Request, res: Response)=>{
    try{
        const schoolId = req.user.schoolId
        const data = await Services.Subject.get(schoolId)
        return successResponse(res, "Subjects fetched Successfully", data)
    }catch(error: any){
        return errorResponse(res, error.message || error)
    }
  }
}
