import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { cookieOptions } from "./utils/cookie-options";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "../email/email.service";

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot(),
    EmailService,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: cookieOptions.maxAge },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
