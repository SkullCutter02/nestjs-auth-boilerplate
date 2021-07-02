import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { IMigrator } from "@mikro-orm/core/typings";
import { EntityManager, MikroORM } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";

import { AuthModule } from "../src/auth/auth.module";
import { testOrmconfig } from "../src/test-utils/testOrmconfig";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let orm: MikroORM;
  let migrator: IMigrator;

  beforeEach(async () => {
    orm = await MikroORM.init(testOrmconfig);
    migrator = orm.getMigrator();

    await migrator.up();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, MikroOrmModule.forRoot(testOrmconfig)],
      providers: [{ provide: EntityManager, useValue: orm.em }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await migrator.down();
    await orm.close(true);
    await app.close();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });
});
