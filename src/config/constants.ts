export const NOTIFICATION_VARIABLE_LIST = [
  "recipientName",
  "recipientRole",
  "recipientEmail",
  "recipientPhone",
  "recipientDob",
] as const;

const SYSTEM_ADMIN_ACCESS = [
  "VIEWER",
  "MAINTAINER",
  "ROOT",
  "SUPER_ROOT",
] as const;
export type SYSTEM_ADMIN_ACCESS_TYPES = (typeof SYSTEM_ADMIN_ACCESS)[number];

const USER_ROLES = [
  "ADMIN",
  "TEACHER",
  "STUDENT",
  "PARENT",
  "ACCOUNTANT",
  "GUARDIAN",
  "SUPER_ADMIN",
] as const;

const GUARDIANS_RELATIONS = ["FATHER", "MOTHER", "BROTHER", "SISTER"] as const;
export type GUARDIANS_TYPES = (typeof GUARDIANS_RELATIONS)[number];

export const NOTIFICATION_CHANNEL_LIST = ["EMAIL", "SMS"] as const;
export type NOTIFICATION_CHANNEL_TYPES =
  (typeof NOTIFICATION_CHANNEL_LIST)[number];

const NOTIFICATION_SENT_STATUS_LIST = [
  "DRAFT",
  "PENDING",
  "SENT",
  "DELIVERED",
  "FAILED",
  "BOUNCED",
] as const;

const ORGANIZATION = ["SYSTEM", "SCHOOL"] as const;
export type ORGANIZATION_TYPES = (typeof ORGANIZATION)[number];

const N_BILLING = {
  PLAN_TYPES: ["PUBLIC", "CUSTOM"] as const,
  USAGE_LIMIT: [
    "DAILY",
    "MONTHLY",
    "WEEKLY",
    "YEARLY",
    "ONE_TIME",
    "NO_LIMIT",
  ] as const,
  PURCHASE_STATUS: ["PENDING", "SUCCEEDED", "FAILED", "CANCELLED"] as const,
  LEDGER_REASON: [
    "SYSTEM_PURCHASED",
    "SUBSCRIPTION_PURCHASED",
    "ADDON_PURCHASES",
    "USAGE",
    "REFUND",
    "ADJUSTMENT",
    "ADMIN_GRANT",
  ] as const,
  SYSTEM_INVENTORY: {
    PROVIDERS: ["RESEND"],
  },
} as const;
export type NOTIFICATION_CHANNEL_PROVIDERS_TYPES =
  (typeof N_BILLING.SYSTEM_INVENTORY.PROVIDERS)[number];

export type NOTIFICATION_LEDGER_REASONS_TYPE =
  (typeof N_BILLING.LEDGER_REASON)[number];

export type DATE_RANGE_TYPES = (typeof N_BILLING.USAGE_LIMIT)[number];

const Constants = {
  GUARDIANS_RELATIONS: Object.fromEntries(GUARDIANS_RELATIONS.map((v) => [v, v])) as {
    readonly [K in (typeof GUARDIANS_RELATIONS)[number]]: K;
  },
  ORGANIZATION: Object.fromEntries(ORGANIZATION.map((v) => [v, v])) as {
    readonly [K in (typeof ORGANIZATION)[number]]: K;
  },
  SYSTEM_ADMIN: {
    ROLE: "SYSTEM_ADMIN",
    ACCESS: Object.fromEntries(SYSTEM_ADMIN_ACCESS.map((v) => [v, v])) as {
      readonly [K in (typeof SYSTEM_ADMIN_ACCESS)[number]]: K;
    },
  },
  USER_ROLES: Object.fromEntries(USER_ROLES.map((v) => [v, v])) as {
    readonly [K in (typeof USER_ROLES)[number]]: K;
  },
  STATUS_CODE: {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
  NOTIFICATION: {
    CHANNEL: Object.fromEntries(
      NOTIFICATION_CHANNEL_LIST.map((v) => [v, v])
    ) as {
      readonly [K in (typeof NOTIFICATION_CHANNEL_LIST)[number]]: K;
    },
    SENT_STATUS: Object.fromEntries(
      NOTIFICATION_SENT_STATUS_LIST.map((v) => [v, v])
    ) as {
      readonly [K in (typeof NOTIFICATION_SENT_STATUS_LIST)[number]]: K;
    },
    VARIABLES: Object.fromEntries(
      NOTIFICATION_VARIABLE_LIST.map((v) => [v, v])
    ) as {
      readonly [K in (typeof NOTIFICATION_VARIABLE_LIST)[number]]: K;
    },
    SENT_SIZE: 50,
    BILLING: {
      PLAN_TYPES: Object.fromEntries(
        N_BILLING.PLAN_TYPES.map((v) => [v, v])
      ) as {
        readonly [K in (typeof N_BILLING.PLAN_TYPES)[number]]: K;
      },
      USAGE_LIMIT: Object.fromEntries(
        N_BILLING.USAGE_LIMIT.map((v) => [v, v])
      ) as {
        readonly [K in (typeof N_BILLING.USAGE_LIMIT)[number]]: K;
      },
      PURCHASE_STATUS: Object.fromEntries(
        N_BILLING.PURCHASE_STATUS.map((v) => [v, v])
      ) as {
        readonly [K in (typeof N_BILLING.PURCHASE_STATUS)[number]]: K;
      },
      LEDGER_REASON: Object.fromEntries(
        N_BILLING.LEDGER_REASON.map((v) => [v, v])
      ) as {
        readonly [K in (typeof N_BILLING.LEDGER_REASON)[number]]: K;
      },
      SYSTEM_INVENTORY: {
        PROVIDERS: Object.fromEntries(
          N_BILLING.SYSTEM_INVENTORY.PROVIDERS.map((v) => [v, v])
        ) as {
          readonly [K in (typeof N_BILLING.SYSTEM_INVENTORY.PROVIDERS)[number]]: K;
        },
      },
    },
  },
};

export default Constants;
