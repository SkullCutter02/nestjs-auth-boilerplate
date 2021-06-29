import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { v4 as uuid } from "uuid";

import { UserRepository } from "./repositories/user.repository";
import { ResetEmailRepository } from "./repositories/reset-email.repository";
import { SignupDto } from "./dto/signup.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { User } from "./entities/user.entity";
import { addMillisecondsToNow } from "../utils/addMillisecondsToNow";
import { Message } from "../shared/types/Message";
import { EmailService } from "../email/email.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(ResetEmailRepository) private resetEmailRepository: ResetEmailRepository,
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

    await this.resetEmailRepository
      .create({
        userId: user.id,
        token,
        expirationDate: addMillisecondsToNow(3_600_000),
      })
      .save(); // 1 hour expiration

    const url = `http://localhost:3000/auth/reset-password/${token}`; // TODO: change to front end link

    await this.emailService.send(user.email, url);

    return { message: "Email sent" };
  }

  async resetPassword({ token, password }: ResetPasswordDto): Promise<Message> {
    const email = await this.resetEmailRepository.findOne({ token });

    if (!email) throw new NotFoundException("Email token not found");

    if (new Date(Date.now()) > email.expirationDate) {
      await email.remove();
      throw new InternalServerErrorException("Reset email expiration date reached");
    }

    const user = await this.userRepository.findOne(email.userId);

    if (!user) throw new NotFoundException("User not found");

    user.hash = await argon2.hash(password);

    await user.save();
    await email.remove();

    return { message: "Password reset" };
  }

  me(user: User): User {
    return user;
  }
}
