import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { v4 as uuid } from "uuid";
import { getTestMessageUrl } from "nodemailer";

import { UserRepository } from "./repositories/user.repository";
import { EmailRepository } from "./repositories/email.repository";
import { SignupDto } from "./dto/signup.dto";
import { User } from "./entities/user.entity";
import { addMillisecondsToNow } from "../utils/addMillisecondsToNow";
import { getTransporter } from "../shared/transporter";
import { Message } from "../shared/types/Message";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(EmailRepository) private emailRepository: EmailRepository,
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

    const info = await (
      await getTransporter()
    ).sendMail({
      from: "coolalan2016@gmail.com", // TODO: change email address
      to: user.email,
      subject: "Reset password",
      text: url,
      html: `<a href="${url}">${url}</a>`,
    });

    console.log(getTestMessageUrl(info)); // TODO: remove when transporter is set up with an actual smtp service

    return { message: "Email sent" };
  }

  me(user: User): User {
    return user;
  }
}
