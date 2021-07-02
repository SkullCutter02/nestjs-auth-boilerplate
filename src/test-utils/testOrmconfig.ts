import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import ormconfig from "../config/ormconfig";

export const testOrmconfig: MikroOrmModuleOptions = {
  ...ormconfig,
  dbName: "nestjs_test_db",
  entities: ["../../**/*.entity.js"],
  entitiesTs: ["../../**/*.entity.ts"],
  debug: false,
};
