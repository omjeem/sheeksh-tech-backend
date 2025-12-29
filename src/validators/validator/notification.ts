import z from "zod";

export class Notification {
  static createCategory = z.object({
    body: z.object({
      categories: z.array(z.string().min(2).max(60)),
    }),
  });

  static createTemplate = z.object({
    body: z.object({
      name: z.string().min(3),
      categoryId: z.uuid(),
      payload: z.object({}),
    }),
  });

  static getTemplateByTemplateId = z.object({
    params: z.object({
      templateId: z.uuid(),
    }),
  });

  static getTemplateByCategoryId = z.object({
    params: z.object({
      categoryId: z.uuid(),
    }),
  });
}
