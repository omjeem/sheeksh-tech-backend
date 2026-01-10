import { Classes } from "./dbServices/class";
import { Notification } from "./dbServices/notification";
import { School } from "./dbServices/school";
import { Section } from "./dbServices/section";
import { Session } from "./dbServices/session";
import { Student } from "./dbServices/student";
import { Subject } from "./dbServices/subject";
import { SystemAdmin } from "./dbServices/systemAdmin";
import { Teacher } from "./dbServices/teacher";
import { User } from "./dbServices/user";
import { email } from "./helper/email";
import { notification } from "./helper/notificationPayload";

const Services = {
  User,
  Teacher,
  Subject,
  Classes,
  Session,
  Section,
  School,
  Student,
  Notification,
  Helper: {
    notification,
    email
  },
  SystemAdmin
};

export default Services;
