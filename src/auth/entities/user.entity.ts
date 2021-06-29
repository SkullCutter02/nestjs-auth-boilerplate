import { Column, Entity } from "typeorm";
import { IsEmail, Matches } from "class-validator";

import { Model } from "../../shared/ModelEntity";
import { usernameRegex } from "../../shared/regexes";

@Entity("users")
export class User extends Model {
  @Column()
  @Matches(usernameRegex)
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  hash: string;

  toJSON(): this {
    return { ...this, hash: undefined };
  }
}
