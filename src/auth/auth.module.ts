import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRepository } from "./user.repository";
import { JwtService } from "./jwt.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
