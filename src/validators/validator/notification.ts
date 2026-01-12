import z from "zod";
import Constants from "@/config/constants";

export class Notification {
  static createCategory = z.object({
    body: z.object({
      categories: z.array(z.string().min(2).max(60)),
    }),
  });

  private static notificationVariables = z.array(
    z.enum(Constants.NOTIFICATION.VARIABLES)
  );

  private static templatePayload = z.object({
    subject: z.string().min(3).max(100),
    bodyHtml: z.string().min(5),
    bodyText: z.string().min(5),
    variables: this.notificationVariables,
  });

  static createTemplate = z.object({
    body: z.object({
      name: z.string().min(3),
      categoryId: z.uuid(),
      payload: this.templatePayload,
    }),
  });

  private static paramsTemplateId = z.object({
    templateId: z.uuid(),
  });

  static getTemplateByTemplateId = z.object({
    params: this.paramsTemplateId,
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

  private static sendAllOrExclude = z
    .object({
      sentAll: z.boolean(),
      isInclude: z.boolean(),
      values: z.array(z.uuid()),
    })
    .optional();

  static draftNotification = z.object({
    params: this.paramsTemplateId,
    body: z.object({
      sessionId: z.uuid().optional(),
      channels: z.array(z.enum(Constants.NOTIFICATION.CHANNEL)).nonempty(),
      users: this.sendAllOrExclude,
      students: this.sendAllOrExclude,
      teachers: this.sendAllOrExclude,
      sections: z
        .array(
          z.object({
            id: z.uuid(),
            sentAll: z.boolean(),
            isInclude: z.boolean(),
            values: z.array(z.uuid()),
          })
        )
        .optional(),
    }),
  });

  static paramsNotificationId = z.object({
    params: z.object({
      notificationId: z.uuid(),
    }),
  });

  static planInstanceId = z.object({
    params: z.object({
      planInstanceId: z.uuid(),
    }),
  });

  static seenNotification = z.object({
    params: z.object({
      notificationRecipentId: z.uuid(),
    }),
  });
}
