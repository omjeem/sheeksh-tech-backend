import {
  and,
  between,
  count,
  desc,
  eq,
  inArray,
  notInArray,
  sql,
  sum,
} from "drizzle-orm";
import { db } from "@/db";
import {
  notification_Table,
  notificationCategory_Table,
  notificationRecipient_Table,
  notificationStatus_Table,
  notificationTemplate_Table,
  notifiSystemInventory_Table,
  notifSchoolLedger_table,
  studentClassSectionTable,
  teachersTable,
  usersTable,
} from "@/db/schema";
import { PostgressTransaction_Type } from "@/types/types";
import { SendNotificationInput } from "@/validators/types";
import Constants, {
  DATE_RANGE_TYPES,
  NOTIFICATION_CHANNEL_TYPES,
  NOTIFICATION_LEDGER_REASONS_TYPE,
} from "@/config/constants";
import { Utils } from "@/utils";
import Services from "..";

const notificationVar = Constants.NOTIFICATION.VARIABLES;

export class Notification {
  static createCategory = async (body: {
    schoolId: string;
    userId: string;
    categories: [string];
  }) => {
    const categoriesArray = body.categories;

    const isCategoryExists = await db
      .select({ category: notificationCategory_Table.category })
      .from(notificationCategory_Table)
      .where(
        and(
          inArray(notificationCategory_Table.category, categoriesArray),
          eq(notificationCategory_Table.schoolId, body.schoolId),
          eq(notificationCategory_Table.isDeleted, false)
        )
      );

    if (isCategoryExists.length > 0) {
      throw new Error(
        `Categories already exists - ${isCategoryExists
          .map((c) => c.category)
          .join(" | ")}`
      );
    }

    const values = body.categories.map((c) => ({
      schoolId: body.schoolId,
      createdBy: body.userId,
      category: c,
    }));

    console.log({ values });
    return await db
      .insert(notificationCategory_Table)
      .values(values)
      .returning({
        id: notificationCategory_Table.id,
        category: notificationCategory_Table.category,
      });
  };

  static getAllCategories = async (schoolId: string) => {
    return await db.query.notificationCategory_Table.findMany({
      where: and(
        eq(notificationCategory_Table.isDeleted, false),
        eq(notificationCategory_Table.schoolId, schoolId)
      ),
      columns: {
        id: true,
        category: true,
        createdAt: true,
      },
    });
  };

  static getCategoryById = async (categoryId: string) => {
    return await db.query.notificationCategory_Table.findFirst({
      where: and(
        eq(notificationCategory_Table.isDeleted, false),
        eq(notificationCategory_Table.id, categoryId)
      ),
    });
  };

  static createTemplate = async (body: {
    schoolId: string;
    userId: string;
    categoryId: string;
    name: string;
    payload: Object;
  }) => {
    const categoryDetail = await this.getCategoryById(body.categoryId);
    if (!categoryDetail) {
      throw new Error("Category not exists");
    }
    if (categoryDetail.schoolId !== body.schoolId) {
      throw new Error("This category is not related with your school");
    }
    return await db
      .insert(notificationTemplate_Table)
      .values({
        schoolId: body.schoolId,
        categoryId: body.categoryId,
        name: body.name,
        templatePayload: body.payload,
        createdBy: body.userId,
      })
      .returning({
        id: notificationTemplate_Table.id,
        categoryId: notificationTemplate_Table.categoryId,
        name: notificationTemplate_Table.name,
        templatePayload: notificationTemplate_Table.templatePayload,
      });
  };

  static getAllTemplate = async (
    schoolId: string,
    templateId: string | null = null
  ) => {
    const whereConditions = [
      eq(notificationTemplate_Table.isDeleted, false),
      eq(notificationTemplate_Table.schoolId, schoolId),
    ];
    if (templateId) {
      whereConditions.push(eq(notificationTemplate_Table.id, templateId));
    }
    return await db.query.notificationTemplate_Table.findMany({
      where: and(...whereConditions),
      columns: {
        id: true,
        name: true,
        templatePayload: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        category: {
          columns: {
            id: true,
            category: true,
          },
        },
      },
    });
  };

  static getTemplateByCategory = async (body: {
    categoryId: string;
    schoolId: string;
  }) => {
    return await db.query.notificationTemplate_Table.findMany({
      where: and(
        eq(notificationTemplate_Table.isDeleted, false),
        eq(notificationTemplate_Table.categoryId, body.categoryId),
        eq(notificationTemplate_Table.schoolId, body.schoolId)
      ),
      columns: {
        id: true,
        name: true,
        templatePayload: true,
      },
      with: {
        category: {
          columns: {
            id: true,
            category: true,
          },
        },
      },
    });
  };

  static getTemplateByIdAndSchoolId = async (body: {
    schoolId: string;
    templateId: string;
  }) => {
    return await db.query.notificationTemplate_Table.findFirst({
      where: and(
        eq(notificationTemplate_Table.isDeleted, false),
        eq(notificationTemplate_Table.id, body.templateId),
        eq(notificationTemplate_Table.schoolId, body.schoolId)
      ),
    });
  };

  static updateTemplateById = async (body: {
    templateId: string;
    userId: string;
    schoolId: string;
    payload: Object;
  }) => {
    console.log({ body });
    const isBelongsToSchool = await this.getTemplateByIdAndSchoolId({
      templateId: body.templateId,
      schoolId: body.schoolId,
    });
    if (!isBelongsToSchool) {
      throw new Error("This template not exist or not belongs to this school");
    }
    return await db
      .update(notificationTemplate_Table)
      .set({
        templatePayload: body.payload,
        updatedAt: new Date(),
      })
      .where(and(eq(notificationTemplate_Table.id, body.templateId)))
      .returning({
        id: notificationTemplate_Table.id,
        name: notificationTemplate_Table.name,
        templatePayload: notificationTemplate_Table.templatePayload,
        createdAt: notificationTemplate_Table.createdAt,
        updatedAt: notificationTemplate_Table.updatedAt,
      });
  };

  static createNewNotification = async (
    tx: PostgressTransaction_Type,
    body: {
      schoolId: string;
      templateId: string;
      categoryId: string;
      payload: any;
      channels: string[];
      userId: string;
    }
  ) => {
    return await tx
      .insert(notification_Table)
      .values({
        schoolId: body.schoolId,
        templateId: body.templateId,
        categoryId: body.categoryId,
        payload: body.payload,
        channels: body.channels,
        createdBy: body.userId,
      })
      .returning();
  };

  static getAndValidateUsersDetailsToSentNotification = async (
    body: SendNotificationInput["body"],
    schoolId: string,
    variables: string[],
    sessionId: string
  ) => {
    console.log({ body, schoolId, variables });

    const requiredUserFields: Record<string, boolean> = {
      id: true,
      email: true,
    };

    variables.forEach((v) => {
      if (v === notificationVar.recipientName) {
        requiredUserFields.firstName = true;
      } else if (v === notificationVar.recipientDob) {
        requiredUserFields.dateOfBirth = true;
      } else if (v === notificationVar.recipientPhone) {
        requiredUserFields.phone = true;
      } else if (v === notificationVar.recipientRole) {
        requiredUserFields.role = true;
      }
    });

    const userInfo = [];

    if (body.users) {
      const whereConditions = [eq(usersTable.schoolId, schoolId)];
      if (!body.users.sentAll) {
        if (body.users.isInclude) {
          whereConditions.push(inArray(usersTable.id, [...body.users.values]));
        } else {
          whereConditions.push(
            notInArray(usersTable.id, [...body.users.values])
          );
        }
      }
      const users = await db.query.usersTable.findMany({
        where: and(...whereConditions),
        columns: { ...requiredUserFields },
      });
      userInfo.push(...users);
    } else {
      if (body.students) {
        const studentsWhereConditions = [
          eq(studentClassSectionTable.schoolId, schoolId),
          eq(studentClassSectionTable.sessionId, sessionId),
        ];
        const students = await db.query.studentClassSectionTable.findMany({
          where: and(...studentsWhereConditions),
          columns: {
            id: true,
          },
          with: {
            student: {
              columns: {
                id: true,
              },
              with: {
                user: {
                  columns: {
                    ...requiredUserFields,
                  },
                },
              },
            },
          },
        });
        const studentsIdSet = new Set(...body.students.values);

        const studentsInfo = students.map((s) => {
          if (body?.students?.sentAll) {
            return s.student.user;
          } else if (body.students?.isInclude) {
            if (studentsIdSet.has(s.student.id)) return s.student.user;
          } else {
            if (!studentsIdSet.has(s.student.id)) return s.student.user;
          }
        });

        userInfo.push(...studentsInfo);
      } else if (body.sections) {
        for (const s of body.sections) {
          const whereConditions = [
            eq(studentClassSectionTable.sessionId, sessionId),
            eq(studentClassSectionTable.schoolId, schoolId),
            eq(studentClassSectionTable.sectionId, s.id),
          ];
          if (!s.sentAll) {
            if (s.isInclude) {
              console.log("Is Include data");
              whereConditions.push(
                inArray(studentClassSectionTable.studentId, [...s.values])
              );
            } else {
              whereConditions.push(
                notInArray(studentClassSectionTable.studentId, [...s.values])
              );
            }
          }
          const sectionsData = await db.query.studentClassSectionTable.findMany(
            {
              where: and(...whereConditions),
              columns: {
                sectionId: true,
              },
              with: {
                student: {
                  columns: {
                    id: true,
                  },
                  with: {
                    user: {
                      columns: {
                        ...requiredUserFields,
                      },
                    },
                  },
                },
              },
            }
          );
          console.dir({ sectionsData }, { depth: null });
          userInfo.push(...sectionsData.map((s) => s.student.user));
        }
      }
      if (body.teachers) {
        const whereConditions = [eq(teachersTable.schoolId, schoolId)];
        if (!body.teachers.sentAll) {
          if (body.teachers.isInclude) {
            whereConditions.push(
              inArray(teachersTable.id, [...body.teachers.values])
            );
          } else {
            whereConditions.push(
              notInArray(teachersTable.id, [...body.teachers.values])
            );
          }
        }
        const teachersInfo = await db.query.teachersTable.findMany({
          where: and(...whereConditions),
          columns: {
            id: true,
          },
          with: {
            user: {
              columns: {
                ...requiredUserFields,
              },
            },
          },
        });
        console.dir({ teachersInfo }, { depth: null });
        userInfo.push(...teachersInfo.map((t) => t.user));
      }
    }
    return userInfo.filter(Boolean);
  };

  static getNotification = async (body: {
    schoolId: string;
    notificationId?: string;
    categoryId?: string;
    templateId?: string;
  }) => {
    const whereConditions = [eq(notification_Table.schoolId, body.schoolId)];
    if (body.notificationId) {
      whereConditions.push(eq(notification_Table.id, body.notificationId));
    }
    if (body.categoryId) {
      whereConditions.push(eq(notification_Table.categoryId, body.categoryId));
    }
    if (body.templateId) {
      whereConditions.push(eq(notification_Table.templateId, body.templateId));
    }
    return await db.query.notification_Table.findMany({
      where: and(...whereConditions),
      columns: {
        id: true,
        templateId: true,
        categoryId: true,
        payload: true,
        channels: true,
        createdAt: true,
      },
      with: {
        status: {
          columns: {
            notificationId: false,
            updatedAt: false,
            isDeleted: false,
          },
        },
      },
    });
  };

  static getNotificationDetailed = async (body: {
    schoolId: string;
    notificationId: string;
    offSet: number;
    limit: number;
  }) => {
    const whereConditions = [
      eq(notification_Table.schoolId, body.schoolId),
      eq(notification_Table.id, body.notificationId),
    ];

    return await db
      .select({
        notificationId: notification_Table.id,
        payload: notification_Table.payload,
        recipentPayload: notificationRecipient_Table.payloadVariables,
        status: notificationRecipient_Table.status,
        seenOnPortal: notificationRecipient_Table.seenOnPortalAt,
        userId: usersTable.id,
        firstName: usersTable.firstName,
      })
      .from(notification_Table)
      .leftJoin(
        notificationRecipient_Table,
        eq(notificationRecipient_Table.notificationId, notification_Table.id)
      )
      .leftJoin(
        notificationStatus_Table,
        eq(notificationStatus_Table.notificationId, notification_Table.id)
      )
      .leftJoin(
        usersTable,
        eq(notificationRecipient_Table.userId, usersTable.id)
      )
      .where(and(...whereConditions))
      .limit(body.limit)
      .offset(body.offSet);
  };

  static getDraftedNotifications = async (body: {
    notificationId: string;
    status?: string;
  }) => {
    const whereConditions = [
      eq(notificationRecipient_Table.notificationId, body.notificationId),
    ];
    if (body.status) {
      whereConditions.push(eq(notificationRecipient_Table.status, body.status));
    }
    return await db.query.notificationRecipient_Table.findMany({
      where: and(...whereConditions),
      columns: {
        id: true,
        channel: true,
        payloadVariables: true,
        status: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  };

  static updateRecipentsNotifications = async (body: {
    userIds: string[];
    notificationId: string;
    status: string;
    channel: string;
  }) => {
    const updateObj: any = {
      status: body.status,
    };
    if (body.status === Constants.NOTIFICATION.SENT_STATUS.SENT) {
      updateObj.deliveredAt = new Date();
    } else {
      updateObj.failedAt = new Date();
    }
    return await db
      .update(notificationRecipient_Table)
      .set({
        ...updateObj,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(notificationRecipient_Table.notificationId, body.notificationId),
          eq(notificationRecipient_Table.channel, body.channel),
          inArray(notificationRecipient_Table.userId, body.userIds)
        )
      );
  };

  static getUserNotification = async (body: {
    userId: string;
    schoolId: string;
  }) => {
    return await db.query.notificationRecipient_Table.findMany({
      where: and(
        eq(notificationRecipient_Table.userId, body.userId),
        eq(
          notificationRecipient_Table.status,
          Constants.NOTIFICATION.SENT_STATUS.SENT
        ),
        eq(notificationRecipient_Table.isDeleted, false)
      ),
      columns: {
        id: true,
        channel: true,
        deliveredAt: true,
        seenOnPortalAt: true,
        createdAt: true,
        payloadVariables: true,
      },
      with: {
        notification: {
          columns: {
            payload: true,
          },
        },
      },
    });
  };

  static seenNotification = async (body: {
    notificationRecipentId: string;
    userId: string;
  }) => {
    const isAlreadySeen = await db.query.notificationRecipient_Table.findFirst({
      where: and(
        eq(notificationRecipient_Table.id, body.notificationRecipentId),
        eq(notificationRecipient_Table.userId, body.userId)
      ),
      columns: {
        seenOnPortalAt: true,
      },
    });
    if (!isAlreadySeen) {
      throw new Error("Notitifcation not exists or not belongs to you!");
    }
    if (isAlreadySeen.seenOnPortalAt) {
      return;
    }
    return await db
      .update(notificationRecipient_Table)
      .set({
        seenOnPortalAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(notificationRecipient_Table.id, body.notificationRecipentId),
          eq(notificationRecipient_Table.userId, body.userId)
        )
      );
  };

  static updateNotificationStatus = async (body: {
    notificationId: string;
    totalSuccess: number;
    totalFailure: number;
    channel: string;
    status: string;
  }) => {
    return await db
      .update(notificationStatus_Table)
      .set({
        totalFailure: body.totalFailure,
        totalSuccess: body.totalSuccess,
        status: body.status,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(notificationStatus_Table.notificationId, body.notificationId),
          eq(notificationStatus_Table.channel, body.channel)
        )
      )
      .returning();
  };

  static addLogsIntoSchoolLedger = async (
    body: {
      schoolId: string;
      operation: NOTIFICATION_LEDGER_REASONS_TYPE;
      planInstanceId?: string;
      channelId?: string;
      notificationId?: string;
      creditsUsed?: number;
      metadata?: string;
      channel?: NOTIFICATION_CHANNEL_TYPES;
    },
    tx?: PostgressTransaction_Type
  ) => {
    const dbObj = tx ?? db;
    return await dbObj
      .insert(notifSchoolLedger_table)
      .values({
        schoolId: body.schoolId,
        operation: body.operation,
        ...(body.planInstanceId && { planInstanceId: body.planInstanceId }),
        ...(body.channelId && { channelId: body.channelId }),
        ...(body.notificationId && { notificationId: body.notificationId }),
        ...(body.creditsUsed && { creditsUsed: body.creditsUsed }),
        ...(body.metadata && { metadata: body.metadata }),
        ...(body.channel && { channelName: body.channel }),
      })
      .returning();
  };

  static getLedger = async (body: {
    schoolId?: string;
    id?: string;
    pageNo: string;
    pageSize: string;
  }) => {
    const limit = parseInt(body.pageSize);
    const offSet = (parseInt(body.pageNo) - 1) * limit;
    const whereConditions = [];
    if (body.schoolId) {
      whereConditions.push(eq(notifSchoolLedger_table.schoolId, body.schoolId));
    }
    if (body.id) {
      whereConditions.push(eq(notifSchoolLedger_table.id, body.id));
    }
    return await db.query.notifSchoolLedger_table.findMany({
      where: and(...whereConditions),
      columns: {
        id: true,
        operation: true,
        creditsUsed: true,
        metadata: true,
        createdAt: true,
      },
      orderBy: (t) => sql`${t.createdAt} desc`,
      limit: limit,
      offset: offSet,
      with: {
        channel: {
          columns: {
            id: true,
            channel: true,
          },
        },
        planInstance: {
          columns: {
            id: true,
            key: true,
            name: true,
          },
        },
        ...(!body.schoolId && {
          school: {
            columns: {
              id: true,
              name: true,
              url: true,
            },
          },
        }),
        ...(body.id && {
          notification: {
            columns: {
              id: true,
              payload: true,
              channels: true,
            },
          },
        }),
      },
    });
  };

  static getCreditsUsagesRangeWise = async (body: {
    frequency: DATE_RANGE_TYPES;
    channel: NOTIFICATION_CHANNEL_TYPES;
    schoolId?: string;
    planInstanceId?: string;
    channelId?: string;
    notificationId?: string;
  }) => {
    const { startDate, endDate } = Utils.getDateRange(body.frequency);
    console.log({
      startDate: startDate.toISOString(),
      start: startDate.toLocaleDateString(),
      endDate: endDate.toISOString(),
      end: endDate.toLocaleDateString(),
    });
    const whereConditions = [
      eq(
        notifSchoolLedger_table.operation,
        Constants.NOTIFICATION.BILLING.LEDGER_REASON.USAGE
      ),
      between(notifSchoolLedger_table.createdAt, startDate, endDate),
      eq(notifSchoolLedger_table.channelName, body.channel),
    ];
    if (body.schoolId) {
      whereConditions.push(eq(notifSchoolLedger_table.schoolId, body.schoolId));
    }
    if (body.planInstanceId) {
      whereConditions.push(
        eq(notifSchoolLedger_table.planInstanceId, body.planInstanceId)
      );
    }
    if (body.channelId) {
      whereConditions.push(
        eq(notifSchoolLedger_table.channelId, body.channelId)
      );
    }

    if (body.notificationId) {
      whereConditions.push(
        eq(notifSchoolLedger_table.notificationId, body.notificationId)
      );
    }

    const info = await db
      .select({
        total: sql<number>`
      COALESCE(SUM(${notifSchoolLedger_table.creditsUsed})::int, 0)
    `,
      })
      .from(notifSchoolLedger_table)
      .where(and(...whereConditions));

    return info[0]?.total || 0;
  };
}
