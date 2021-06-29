import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { SignupDto } from "./dto/signup.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { User } from "./entities/user.entity";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { cookieOptions } from "./utils/cookie-options";
import { Message } from "../shared/types/Message";

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

  @Post("/logout")
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response): Message {
    res.clearCookie("token");
    return { message: "Logout successful!" };
  }

  @Post("/forgot-password")
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() { email }: ForgotPasswordDto): Promise<Message> {
    return this.authService.forgotPassword(email);
  }

  @Post("/reset-password")
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<Message> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get("/me")
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request): Promise<User> {
    return this.authService.me(req.user as User);
  }
}
