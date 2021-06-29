import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

import { UserRepository } from "../repositories/user.repository";
import { JwtPayload } from "../../shared/types/JwtPayload";

export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (!req || !req.cookies) return null;

          return req.cookies["token"];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ id }: JwtPayload) {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new UnauthorizedException("User not found");

    return user;
  }
}
