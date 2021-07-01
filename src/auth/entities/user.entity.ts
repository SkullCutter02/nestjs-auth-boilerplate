import { Entity, EntityRepositoryType, Property } from "@mikro-orm/core";
import { IsEmail, Matches } from "class-validator";

import { BaseEntityEntity } from "../../shared/baseEntity.entity";
import { usernameRegex } from "../../shared/regexes";
import { UserRepository } from "../repositories/user.repository";

@Entity({ tableName: "users", customRepository: () => UserRepository })
export class User extends BaseEntityEntity {
  @Property()
  @Matches(usernameRegex)
  username: string;

  @Property()
  @IsEmail()
  email: string;

  @Property()
  hash: string;

  [EntityRepositoryType]?: UserRepository;

  toJSON(): this {
    return { ...this, hash: undefined };
  }
}
