import { createTestAccount, createTransport } from "nodemailer";

export const getTransporter = async () => {
  const account = await createTestAccount();

  return createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });
};
