import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as argon2 from "argon2";

import { UserRepository } from "./user.repository";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {}

  async signup({ username, email, password }: SignupDto): Promise<User> {
    if (await this.userRepository.isExist(username, email)) {
      const hash = await argon2.hash(password);

      const user = this.userRepository.create({ username, email, hash });

      await user.save();
      return user;
    }
  }

  async login({ credentials }: LoginDto) {
    return await this.userRepository.findByCredentials(credentials);
  }
}
