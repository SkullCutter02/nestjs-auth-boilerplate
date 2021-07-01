import { Test, TestingModule } from "@nestjs/testing";
import { Request, Response } from "express";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";

// mock constants
const MOCK_JWT = "I'm a JWT";
const EMAIL_SENT_MSG = "Email sent";
const PASSWORD_RESET_MSG = "Password reset";
const USER = { id: 1, username: "s", email: "d@gmail.com" };

describe("AuthController", () => {
  let controller: AuthController;

  const mockAuthService = {
    signup: jest.fn(() => MOCK_JWT),
    login: jest.fn(() => MOCK_JWT),
    forgotPassword: jest.fn(() => {
      return { message: EMAIL_SENT_MSG };
    }),
    resetPassword: jest.fn(() => {
      return { message: PASSWORD_RESET_MSG };
    }),
    me: jest.fn(() => USER),
  };

  const mockReq = {} as unknown as Request;
  const mockRes = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("signup", () => {
    const mockDto: SignupDto = { username: "skull", email: "s@gmail.com", password: "4e4e4e4e" };

    it("should return an object containing a JWT token", async () => {
      expect(await controller.signup(mockDto, mockRes)).toEqual({ token: MOCK_JWT });
    });

    it("should call AuthService.signup", async () => {
      await controller.signup(mockDto, mockRes);
      expect(mockAuthService.signup).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should return an object containing a JWT token", async () => {
      expect(await controller.login(mockReq, mockRes)).toEqual({ token: MOCK_JWT });
    });

    it("should call AuthService.signup", async () => {
      await controller.login(mockReq, mockRes);
      expect(mockAuthService.signup).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should return a logout successful message", async () => {
      expect(await controller.logout(mockRes)).toEqual({ message: "Logout successful" });
    });
  });

  describe("forgotPassword", () => {
    it("should return a email sent successful message", async () => {
      expect(await controller.forgotPassword({ email: "s@gmail.com" })).toEqual({ message: EMAIL_SENT_MSG });
    });

    it("should call AuthService.forgotPassword", async () => {
      await controller.forgotPassword({ email: "s@gmail.com" });
      expect(mockAuthService.forgotPassword).toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("should return a password reset successful message", async () => {
      expect(await controller.resetPassword({ token: "d", password: "d" })).toEqual({
        message: PASSWORD_RESET_MSG,
      });
    });

    it("should call AuthService.resetPassword", async () => {
      await controller.resetPassword({ token: "d", password: "d" });
      expect(mockAuthService.resetPassword).toHaveBeenCalled();
    });
  });

  describe("me", () => {
    it("should return a user object", async () => {
      expect(await controller.me(mockReq)).toEqual(USER);
    });

    it("should call AuthService.me", async () => {
      await controller.me(mockReq);
      expect(mockAuthService.me).toHaveBeenCalled();
    });
  });
});
