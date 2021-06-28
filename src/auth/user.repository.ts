import { EntityRepository, Repository } from "typeorm";
import { ConflictException } from "@nestjs/common";

import { User } from "./entities/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async isExist(username: string, email: string) {
    const isEmail = !!(await this.findOne({ email }));
    const isUsername = !!(await this.findOne({ username }));

    if (isEmail) throw new ConflictException("Email already exists");
    if (isUsername) throw new ConflictException("Username already exists");

    return true;
  }
}
