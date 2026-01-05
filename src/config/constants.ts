const NOTIFICATION_VARIABLE_LIST = [
  "recipientName",
  "recipientRole",
  "recipientEmail",
  "recipientPhone",
  "recipientDob",
] as const;

export const NOTIFICATION_CHANNEL_LIST = ["EMAIL", "SMS"] as const;

const NOTIFICATION_SENT_STATUS_LIST = [
  "DRAFT",
  "PENDING",
  "SENT",
  "DELIVERED",
  "FAILED",
  "BOUNCED",
] as const;

const Constants = {
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
  },
};

export default Constants;
