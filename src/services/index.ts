import { Classes } from "./dbServices/class";
import { Notification } from "./dbServices/notification";
import { School } from "./dbServices/school";
import { Section } from "./dbServices/section";
import { Session } from "./dbServices/session";
import { Student } from "./dbServices/student";
import { Subject } from "./dbServices/subject";
import { Teacher } from "./dbServices/teacher";
import { User } from "./dbServices/user";
import { notification } from "./helper/notification";

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
  },
};

export default Services;
