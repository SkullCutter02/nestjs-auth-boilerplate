import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";

import { UserRepository } from "./user.repository";
import { SignupDto } from "./dto/signup.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup({ username, email, password }: SignupDto): Promise<string> {
    if (await this.userRepository.isExist(username, email)) {
      const hash = await argon2.hash(password);

      const user = this.userRepository.create({ username, email, hash });

      await user.save();

      return this.jwtService.sign({ id: user.id });
    }
  }

  async login(user: User): Promise<string> {
    return this.jwtService.sign({ id: user.id });
  }

  me(user: User): User {
    return user;
  }
}
