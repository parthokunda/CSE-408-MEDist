// external imports
import { object, string, union, TypeOf, number } from "zod";

// internal imports
import { UserRole } from "../database/models/User.model";

export interface Auth_Schema_Interface {
  Signup_or_Login: object;
}

class AuthSchema implements Auth_Schema_Interface {
  // ------------------------- SignUp or Login Schema -------------------------
  Signup_or_Login = object({
    body: object({
      email: string({
        required_error: "Email is required",
      }).email("Invalid email"),

      password: string({
        required_error: "Password is required",
      }).min(4, "Password must be at least 4 characters long"),

      role: string({
        required_error: "Role is required",
      }).refine((val) => Object.values(UserRole).includes(val as UserRole), {
        message: `Role must be one of ${Object.values(UserRole).join(", ")}`,
      }),
    }),
  });
}

export default new AuthSchema();

export type Signup_or_Login_Input = TypeOf<
  AuthSchema["Signup_or_Login"]
>["body"];
