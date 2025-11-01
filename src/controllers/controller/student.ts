import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../config/response";
import { db } from "../../config/db";
import {
  studentClassesTable,
  studentsTable,
  usersTable,
} from "../../config/schema";
import { and, eq, inArray } from "drizzle-orm";
import { Utils } from "../../utils/dateTime";
import Services from "../../services";
import { UserRoles } from "../../types/types";

interface StudentData {
  srNo: number;
  password?: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export class Student {
  static feedStudents = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const { classId, sessionId, sectionId } = body;
      const schoolId = req.user.schoolId;
      const studentData: StudentData[] = body.studentData;
      console.log({ studentData });
      const dataToFeed = studentData.map((d) => {
        return {
          srNo: d.srNo,
          dateOfBirth: Utils.toUTCFromIST(d.dateOfBirth),
          schoolId,
          role: UserRoles.STUDENT,
          email: d.email,
          password: d.password
            ? d.password
            : `${d.firstName}-${Math.random().toFixed(3)}`,
          firstName: d.firstName,
          lastName: d.lastName,
        };
      });
      const emailsToCheck = dataToFeed.map((d) => d.email);

      const srNoCheck = dataToFeed
        .map((d) => String(d.srNo))
        .filter((f) => f != null);

      if (srNoCheck.length > 0) {
        const existingSrNo = await db
          .select({ srNo: studentsTable.srNo })
          .from(studentsTable)
          .where(
            and(
              inArray(studentsTable.srNo, srNoCheck.map(String)),
              eq(studentsTable.schoolId, schoolId)
            )
          );

        if (existingSrNo.length > 0) {
          const duplicateSrNo = existingSrNo.map((e) => e.srNo).join(", ");
          throw new Error(`Duplicate SrNo found: ${duplicateSrNo}`);
        }
      }

      if (emailsToCheck.length > 0) {
        await Services.UserService.isUsersExists(emailsToCheck);
      }

      await db.transaction(async (tx) => {
        const userFeed = await tx
          .insert(usersTable)
          .values(dataToFeed.map(({ srNo, dateOfBirth, ...rest }) => rest))
          .returning({
            userId: usersTable.id,
            email: usersTable.email,
          });

        const studentFeed: any = userFeed.map((u, index) => {
          return {
            userId: u.userId,
            schoolId,
            srNo: dataToFeed[index]?.srNo,
            dateOfBirth: dataToFeed[index]?.dateOfBirth,
          };
        });

        const students = await tx
          .insert(studentsTable)
          .values(studentFeed)
          .returning({
            studentId: studentsTable.id,
          });

        const studentClassFeed = students.map((s) => {
          return {
            ...s,
            classId,
            sectionId,
            sessionId,
          };
        });

        await tx.insert(studentClassesTable).values(studentClassFeed);
      });
      return successResponse(res, 201, "Student Feed Successfully");
    } catch (error: any) {
      console.log("Error while feeding user data", error);
      return errorResponse(res, 400, error.message || error);
    }
  };
}
