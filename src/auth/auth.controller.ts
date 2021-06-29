import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { User } from "./entities/user.entity";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { cookieOptions } from "./utils/cookie-options";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  @UsePipes(ValidationPipe)
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ token: string }> {
    const token = await this.authService.signup(signupDto);
    res.cookie("token", token, cookieOptions);
    return { token };
  }

  @Post("/login")
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<{ token: string }> {
    const token = await this.authService.login(req.user as User);
    res.cookie("token", token, cookieOptions);
    return { token };
  }

  @Get("/me")
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request): Promise<User> {
    return this.authService.me(req.user as User);
  }
}
