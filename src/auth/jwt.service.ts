import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtService {
  sign(payload: string): string {
    return jwt.sign({ id: payload }, "secretkey");
  }
}
