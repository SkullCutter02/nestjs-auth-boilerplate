import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRepository } from "./repositories/user.repository";
import { ResetEmailRepository } from "./repositories/reset-email.repository";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { cookieOptions } from "./utils/cookie-options";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "../email/email.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, ResetEmailRepository]),
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: cookieOptions.maxAge },
    }),
    EmailService,
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
