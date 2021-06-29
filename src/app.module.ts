import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import ormconfig from "./config/ormconfig";

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), AuthModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
