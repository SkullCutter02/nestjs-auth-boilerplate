import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as argon2 from "argon2";

import { UserRepository } from "../user.repository";
import { User } from "../entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {
    super({
      usernameField: "credentials",
      passwordField: "password",
    });
  }

  async validate(credentials: string, password: string): Promise<User> {
    const user = await this.userRepository.findByCredentials(credentials);

    if (!user) throw new UnauthorizedException("Invalid credentials");

    if (!(await argon2.verify(user.hash, password))) throw new UnauthorizedException("Invalid credentials");

    delete user.hash;
    return user;
  }
}
