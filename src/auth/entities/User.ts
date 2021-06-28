import { Column, Entity } from "typeorm";
import { IsEmail, Matches } from "class-validator";

import { Model } from "../../shared/ModelEntity";

@Entity("users")
export class User extends Model {
  @Column()
  @Matches(/^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/)
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  hash: string;
}
