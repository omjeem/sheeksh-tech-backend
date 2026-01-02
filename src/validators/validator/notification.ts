import z from "zod";
import Constants from "../../config/constants";

export class Notification {
  static createCategory = z.object({
    body: z.object({
      categories: z.array(z.string().min(2).max(60)),
    }),
  });

  static templatePayload = z.object({
    subject: z.string().min(3).max(100),
    bodyHtml: z.string().min(5),
    bodyText: z.string().min(5),
    variables: z.array(z.enum(Constants.NOTIFICATION.VARIABLES)),
  });

  static createTemplate = z.object({
    body: z.object({
      name: z.string().min(3),
      categoryId: z.uuid(),
      payload: this.templatePayload,
    }),
  });

  static getTemplateByTemplateId = z.object({
    params: z.object({
      templateId: z.uuid(),
    }),
  });

  static updateTemplate = z.object({
    params: z.object({
      templateId: z.uuid(),
    }),
    body: this.templatePayload,
  });

  static getTemplateByCategoryId = z.object({
    params: z.object({
      categoryId: z.uuid(),
    }),
  });
}
