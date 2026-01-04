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
    CHANNEL: {
      PORTAL: "PORTAL",
      EMAIL: "EMAIL",
      SMS: "SMS",
    },
    SENT_STATUS: {
      PENDING: "PENDING",
      SENT: "SENT",
      DELIVERED: "DELIVERED",
      FAILED: "FAILED",
      BOUNCED: "BOUNCED",
    },
    VARIABLES: {
      recipientName: "recipientName",
      recipientRole: "recipientRole",
      recipientEmail : "recipientEmail"
    },
  },
};

export default Constants;
