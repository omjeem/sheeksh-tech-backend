import { NotificationTemplatePayload } from "@/types/types";

export class notification {
  private static applyTemplateVariables = (
    template: string,
    variables: Record<string, string>
  ) => {
    return template.replace(/{{\s*(\w+)\s*}}/g, (match, variableName) => {
      const value = variables[variableName];
      //   console.log({ value, match, variableName, variables });
      if (value === undefined || value === null) {
        throw new Error(`Missing variable: ${variableName}`);
      }
      return String(value);
    });
  };

  static buildNotificationPayload = (
    template: NotificationTemplatePayload,
    values: Record<string, string>
  ) => {
    for (const variable of template.variables) {
      if (!(variable in values)) {
        throw new Error(`Missing variable value: ${variable}`);
      }
    }
    const obj = {
      subject: this.applyTemplateVariables(template.subject, values),
      bodyHtml: template.bodyHtml
        ? this.applyTemplateVariables(template.bodyHtml, values)
        : null,
      bodyText: template.bodyText
        ? this.applyTemplateVariables(template.bodyText, values)
        : null,
    };
    return obj;
  };
}
