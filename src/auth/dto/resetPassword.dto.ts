import { IsUUID, Matches } from "class-validator";

import { passwordRegex } from "../../shared/regexes";

export class ResetPasswordDto {
  @IsUUID()
  token: string;

  @Matches(passwordRegex, {
    message: "Password must be at least 8 characters long, and have at least one letter and one number",
  })
  password: string;
}
