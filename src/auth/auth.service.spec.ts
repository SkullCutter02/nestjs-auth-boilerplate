import { Test, TestingModule } from "@nestjs/testing";
import { EntityManager } from "@mikro-orm/core";
import { EntityClass } from "@mikro-orm/core/typings";
import { JwtService } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { EmailService } from "../email/email.service";
import { User } from "./entities/user.entity";

// test constants
const MOCK_JWT = "I'm a JWT";
const EMAIL_SENT_MSG = { message: "Email sent" };
const RESET_PASSWORD_MSG = { message: "Password reset" };

describe("AuthService", () => {
  let service: AuthService;

  const mockEm = {
    getRepository: (_: EntityClass<any>) => {
      return {
        isExist: jest.fn().mockImplementation((_, __) => true),
        findOne: jest.fn().mockImplementation((_) => {
          return { hash: "_" };
        }),
        create: jest.fn().mockImplementation((dto) => dto),
        persistAndFlush: jest.fn().mockImplementation((_) => null),
        removeAndFlush: jest.fn().mockImplementation((_) => null),
      };
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockImplementation((_) => MOCK_JWT),
  };

  const mockEmailService = {
    send: jest.fn().mockImplementation((_, __, ___) => null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: EntityManager, useValue: mockEm },
        { provide: JwtService, useValue: mockJwtService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("signup", () => {
    it("should return a JWT token", async () => {
      expect(await service.signup({ username: "_", email: "_", password: "_" })).toEqual(MOCK_JWT);
    });
  });

  describe("login", () => {
    it("should return a JWT token", async () => {
      expect(await service.login({} as unknown as User)).toEqual(MOCK_JWT);
    });
  });

  describe("forgotPassword", () => {
    it("should return an email sent successful message", async () => {
      expect(await service.forgotPassword("d")).toEqual(EMAIL_SENT_MSG);
    });
  });

  describe("resetPassword", () => {
    it("should return a password reset successful message", async () => {
      expect(await service.resetPassword({ token: "_", password: "_" })).toEqual(RESET_PASSWORD_MSG);
    });
  });

  describe("me", () => {
    const user = { hi: "bye" } as unknown as User;

    it("should return the user passed into the function", () => {
      expect(service.me(user)).toEqual(user);
    });
  });
});
