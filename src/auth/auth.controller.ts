import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { Response } from "express";

import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "./jwt.service";
import { cookieOptions } from "./utils/cookieOptions";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @Post("/signup")
  @UsePipes(ValidationPipe)
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    const user = await this.authService.signup(signupDto);
    const token = this.jwtService.sign(user.id);
    res.cookie("token", token, cookieOptions);
    return res.json(user);
  }

  @Post("/login")
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.login(loginDto);
    const token = this.jwtService.sign(user.id);
    res.cookie("token", token, cookieOptions);
    return res.json(user);
  }
}
