import { EntityRepository } from "@mikro-orm/core";
import { ConflictException } from "@nestjs/common";

import { User } from "../entities/user.entity";

export class UserRepository extends EntityRepository<User> {
  async isExist(username: string, email: string): Promise<boolean> {
    const isEmail = !!(await this.findOne({ email }));
    const isUsername = !!(await this.findOne({ username }));

    if (isEmail) throw new ConflictException("Email already exists");
    if (isUsername) throw new ConflictException("Username already exists");

    return true;
  }

  async findByCredentials(credentials: string): Promise<User> {
    if (credentials.includes("@")) return this.findOne({ email: credentials });
    else return this.findOne({ username: credentials });
  }
}
