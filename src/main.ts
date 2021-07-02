import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import atob from "atob";
import nodeBlob from "node-blob";

import { AppModule } from "./app.module";

const PORT = 5000 || process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  await app.listen(PORT);

  console.log(`Server started on port ${PORT}`);
}

bootstrap();
