import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const ormconfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: null,
  database: "nestjs_test",
  logging: true,
  entities: [__dirname + "/../**/entities/*{.ts,.js}"],
  migrations: [__dirname + "/../migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "src/migrations",
  },
};

export = ormconfig;
