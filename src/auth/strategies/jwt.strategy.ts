import { PassportStrategy } from "@nestjs/passport";
import { EntityManager } from "@mikro-orm/core";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

import { JwtPayload } from "../../shared/types/JwtPayload";
import { User } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly em: EntityManager) {
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
    const user = await this.em.getRepository(User).findOne(id);

    if (!user) throw new UnauthorizedException("User not found");

    return user;
  }
}
