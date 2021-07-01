import { MikroOrmModuleSyncOptions } from "@mikro-orm/nestjs";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

const ormconfig: MikroOrmModuleSyncOptions = {
  type: "postgresql",
  host: "localhost",
  port: 5432,
  dbName: "nestjs_test",
  baseDir: __dirname,
  entities: ["../**/*.entity.js"],
  entitiesTs: ["../**/*.entity.ts"],
  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV === "development",
  migrations: {
    path: __dirname + "/../migrations",
  },
};

export = ormconfig;
