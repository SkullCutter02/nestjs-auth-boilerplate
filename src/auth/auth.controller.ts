import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  @UsePipes(ValidationPipe)
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post("/login")
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
