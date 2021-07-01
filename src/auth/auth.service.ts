import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/core";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { v4 as uuid } from "uuid";

import { SignupDto } from "./dto/signup.dto";
import { ResetPasswordDto } from "./dto/resetPassword.dto";
import { User } from "./entities/user.entity";
import { ResetEmail } from "./entities/resetEmail.entity";
import { addMillisecondsToNow } from "../utils/addMillisecondsToNow";
import { Message } from "../shared/types/Message";
import { EmailService } from "../email/email.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signup({ username, email, password }: SignupDto): Promise<string> {
    if (await this.em.getRepository(User).isExist(username, email)) {
      const hash = await argon2.hash(password);

      const user = this.em.getRepository(User).create({ username, email, hash });

      await this.em.getRepository(User).persistAndFlush(user);

      return this.jwtService.sign({ id: user.id });
    }
  }

  async login(user: User): Promise<string> {
    return this.jwtService.sign({ id: user.id });
  }

  async forgotPassword(email: string): Promise<Message> {
    const user = await this.em.getRepository(User).findOne({ email });

    if (!user) throw new NotFoundException("User not found");

    const token = uuid();

    const resetEmail = await this.em.getRepository(ResetEmail).create({
      userId: user.id,
      token,
      expirationDate: addMillisecondsToNow(3_600_000), // 1 hour expiration
    });

    await this.em.getRepository(ResetEmail).persistAndFlush(resetEmail);

    const url = `http://localhost:3000/auth/reset-password/${token}`; // TODO: change to front end link

    await this.emailService.send(user.email, url);

    return { message: "Email sent" };
  }

  async resetPassword({ token, password }: ResetPasswordDto): Promise<Message> {
    const email = await this.em.getRepository(ResetEmail).findOne({ token });

    if (!email) throw new NotFoundException("Email token not found");

    if (new Date(Date.now()) > email.expirationDate) {
      await this.em.getRepository(ResetEmail).removeAndFlush(email);
      throw new InternalServerErrorException("Reset email expiration date reached");
    }

    const user = await this.em.getRepository(User).findOne(email.userId);

    if (!user) throw new NotFoundException("User not found");

    user.hash = await argon2.hash(password);

    await this.em.getRepository(User).persistAndFlush(user);
    await this.em.getRepository(ResetEmail).removeAndFlush(email);

    return { message: "Password reset" };
  }

  me(user: User): User {
    return user;
  }
}
