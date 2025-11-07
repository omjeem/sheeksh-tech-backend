import { and, eq } from "drizzle-orm";
import { db } from "../../config/db";
import { sessionsTable } from "../../config/schema";
import { Utils } from "../../utils/dateTime";

export class Session {
  static create = async (
    schoolId: string,
    name: string,
    startDate: Date,
    endDate: Date,
    isActive: boolean
  ) => {
    if (isActive) await this.isSessionActive(schoolId);
    return await db
      .insert(sessionsTable)
      .values({
        schoolId,
        name,
        startDate,
        endDate,
        isActive,
      })
      .returning();
  };

  private static isSessionActive = async (schoolId: string) => {
    const isCurrentSessionExists = await db.query.sessionsTable.findFirst({
      where: and(
        eq(sessionsTable.isActive, true),
        eq(sessionsTable.schoolId, schoolId)
      ),
    });
    if (isCurrentSessionExists) {
      throw new Error(
        "There is already an active session exists for the school."
      );
    }
  };

  static changeSessionActiveState = async (
    sessionId: string,
    schoolId: string,
    status: boolean
  ) => {
    const session = await db.query.sessionsTable.findFirst({
      where: eq(sessionsTable.id, sessionId),
    });
    if (session?.schoolId !== schoolId) {
      throw new Error("This session is not related with this school!");
    }
    if (status) await this.isSessionActive(schoolId);
    return await db
      .update(sessionsTable)
      .set({ isActive: status })
      .where(and(eq(sessionsTable.id, sessionId)));
  };

  static get = async (schoolId: string, active: boolean) => {
    const conditions = [eq(sessionsTable.schoolId, schoolId)];
    if (active) conditions.push(eq(sessionsTable.isActive, true));
    return await db.query.sessionsTable.findMany({
      where: and(...conditions),
      columns: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        isActive: true,
      },
    });
  };
}
