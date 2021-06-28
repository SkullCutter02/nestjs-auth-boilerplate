import { IsEmail, Matches } from "class-validator";

import { passwordRegex, usernameRegex } from "../../shared/regexes";

export class SignupDto {
  @Matches(usernameRegex, {
    message: "Username must only contain alphanumeric letters, numbers, hyphens and underscores",
  })
  username: string;

  @IsEmail()
  email: string;

  @Matches(passwordRegex, {
    message: "Password must be at least 8 characters long, and have at least one letter and one number",
  })
  password: string;
}
