import { CookieOptions } from "express";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 2_592_000_000, // 30 days
};
