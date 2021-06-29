import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { v4 as uuid } from "uuid";

import { UserRepository } from "./repositories/user.repository";
import { ResetEmailRepository } from "./repositories/reset-email.repository";
import { SignupDto } from "./dto/signup.dto";
import { User } from "./entities/user.entity";
import { addMillisecondsToNow } from "../utils/addMillisecondsToNow";
import { Message } from "../shared/types/Message";
import { EmailService } from "../email/email.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(ResetEmailRepository) private emailRepository: ResetEmailRepository,
    private jwtService: JwtService,
    private emailService: EmailService,
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

  async forgotPassword(email: string): Promise<Message> {
    const user = await this.userRepository.findOne({ email });

    if (!user) throw new NotFoundException("User not found");

    const token = uuid();

    await this.emailRepository.create({
      userId: user.id,
      token,
      expirationDate: addMillisecondsToNow(3_600_000),
    }); // 1 hour expiration

    const url = `http://localhost:3000/auth/reset-password/${token}`; // TODO: change to front end link

    await this.emailService.send(user.email, url);

    return { message: "Email sent" };
  }

  me(user: User): User {
    return user;
  }
}
