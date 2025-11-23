import { envConfigs } from "../config/envConfig";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import { UserRolesType, UserTokenPayload } from "../types/types";
import crypto from "crypto";

type VerifyTokenSuccess = {
  valid: true;
  data: UserTokenPayload;
};

type VerifyTokenFailure = {
  valid: false;
  error: string;
};

type VerifyTokenResult = VerifyTokenSuccess | VerifyTokenFailure;

export class Utils {
  // dateString = "01-04-2025"
  static toUTCFromIST = (dateString: string | undefined) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}T00:00:00+05:30`);
  };

  static generateJwt = async (
    email: string,
    schoolId: string,
    role: UserRolesType,
    userId: string | null
  ) => {
    const jwtPayload = {
      user: {
        userId,
        email,
        schoolId,
        role,
      },
    };
    return jwt.sign(jwtPayload, envConfigs.jwt.secret, {
      expiresIn: `${envConfigs.jwt.expiresIn}d`,
    });
  };

  static verifyTokenAndGetPayload = (token: string): VerifyTokenResult => {
    try {
      const decoded: any = jwt.verify(token, envConfigs.jwt.secret);
      delete decoded.iat;
      delete decoded.exp;
      return { valid: true, data: decoded };
    } catch (err: any) {
      console.log("Error in verifying ", err);
      return {
        valid: false,
        error: err.message || "Token authentication failed! please login again",
      };
    }
  };

  static hashPassword = (password: string, email: string) => {
    const salted = password + email;
    return crypto.createHash("sha256").update(salted).digest("base64url");
  };

  static verifyPassword = (
    plainPassword: string,
    email: string,
    hashedPassword: string
  ) => {
    const newHash = this.hashPassword(plainPassword, email);
    return newHash === hashedPassword;
  };

  static defaultPassword = (firstName: string, email: string) => {
    return `${firstName}-${email}`;
  };
}
