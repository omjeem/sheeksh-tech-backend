import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../config/db";
import {
  schoolsTable,
  studentClassesTable,
  studentsTable,
  usersTable,
} from "../../config/schema";
import Services from "..";
import {
  FeedStudents_Type,
  GetStudentClassSection_Type,
} from "../../validators/validator/student";
import { Utils } from "../../utils";
import Constants from "../../config/constants";

export class Student {
  static getLastSrNo = async (schoolId: string) => {
    const srData = await db
      .select({ srNo: studentsTable.srNo })
      .from(studentsTable)
      .where(eq(studentsTable.schoolId, schoolId))
      .orderBy(desc(studentsTable.srNo))
      .limit(1);
    return srData[0]?.srNo || 0;
  };

  static feedStudent = async (schoolId: string, body: FeedStudents_Type) => {
    const {
      classId,
      sessionId,
      sectionId,
      studentData,
      selfAssignSr = false,
    } = body;
    let lastSrNo: number;
    if (selfAssignSr) lastSrNo = await this.getLastSrNo(schoolId);
    const dataToFeed = studentData.map((d) => {
      const hashedPassword = Utils.hashPassword(
        d.password || `${d.firstName}-${d.email}`,
        d.email
      );
      const dateOfBirth = Utils.toUTCFromIST(d.dateOfBirth);
      console.log({ dateOfBirth });
      return {
        srNo: selfAssignSr ? ++lastSrNo : d.srNo,
        dateOfBirth,
        schoolId,
        role: Constants.USER_ROLES.STUDENT,
        email: d.email,
        password: hashedPassword,
        firstName: d.firstName,
        lastName: d.lastName,
        // parent : d.parent
      };
    });
    const emailsToCheck = dataToFeed.map((d) => d.email);

    const srNoCheck = dataToFeed.map((d) => d.srNo).filter((f) => f != null);

    if (srNoCheck.length > 0) {
      const existingSrNo = await db
        .select({ srNo: studentsTable.srNo })
        .from(studentsTable)
        .where(
          and(
            inArray(studentsTable.srNo, srNoCheck),
            eq(studentsTable.schoolId, schoolId)
          )
        );

      if (existingSrNo.length > 0) {
        const duplicateSrNo = existingSrNo.map((e) => e.srNo).join(", ");
        throw new Error(`Duplicate SrNo found: ${duplicateSrNo}`);
      }
    }

    if (emailsToCheck.length > 0) {
      await Services.User.isUsersExists(emailsToCheck);
    }

    await db.transaction(async (tx) => {
      const userFeed = await tx
        .insert(usersTable)
        .values(
          dataToFeed.map(
            ({
              srNo,
              //  parent,
              ...rest
            }) => rest
          )
        )
        .returning({
          userId: usersTable.id,
          email: usersTable.email,
        });

      const studentFeed: any = userFeed.map((u, index) => {
        return {
          userId: u.userId,
          schoolId,
          srNo: dataToFeed[index]?.srNo,
          // parent: dataToFeed[index]?.parent
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
          schoolId,
          sectionId,
          sessionId,
        };
      });

      await tx.insert(studentClassesTable).values(studentClassFeed);
    });
  };

  static getStudentBySchoolId = async (schoolId: string) => {
    console.log({ schoolId });
    return await db.query.studentsTable.findMany({
      where: and(eq(studentsTable.schoolId, schoolId)),
      columns: {
        id: true,
        srNo: true,
        createdAt: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
          },
        },
      },
    });
  };

  static getStudentClassData = async (
    schoolId: string,
    conditions: GetStudentClassSection_Type
  ) => {
    const { sectionId, sessionId, classId, studentId } = conditions;
    const whereCondition = [eq(studentClassesTable.schoolId, schoolId)];
    if (sectionId) {
      whereCondition.push(eq(studentClassesTable.sectionId, sectionId));
    }
    if (sessionId) {
      whereCondition.push(eq(studentClassesTable.sessionId, sessionId));
    }
    if (classId) {
      whereCondition.push(eq(studentClassesTable.classId, classId));
    }
    if (studentId) {
      whereCondition.push(eq(studentClassesTable.studentId, studentId));
    }
    return await db.query.studentClassesTable.findMany({
      where: and(...whereCondition),
      columns: {
        id: true,
        studentId: true,
      },
      with: {
        student: {
          columns: {
            srNo: true,
          },
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        class: {
          columns: {
            id: true,
            name: true,
          },
        },
        section: {
          columns: {
            id: true,
            name: true,
          },
        },
        session: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  };
}
