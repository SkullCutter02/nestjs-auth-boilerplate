import { NestFactory } from "@nestjs/core";
import session from "express-session";
import passport from "passport";

import { AppModule } from "./app.module";

const PORT = 5000 || process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TODO: make session storage (redis or postgres)
  app.use(
    session({
      secret: "secret", // TODO: move to env file
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3_600_000 },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(PORT);

  console.log(`Server started on port ${PORT}`);
}

bootstrap();
