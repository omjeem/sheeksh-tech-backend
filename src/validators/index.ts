import { Auth } from "./validator/auth";
import { Class } from "./validator/class";
import { School } from "./validator/school";
import { Section } from "./validator/section";
import { Session } from "./validator/session";
import { Student } from "./validator/student";
import { Subject } from "./validator/subject";
import { Teacher } from "./validator/teacher";

const Validators = {
  Auth,
  School,
  Student,
  Subject,
  Session,
  Section,
  Class,
  Teacher
};

export default Validators;
