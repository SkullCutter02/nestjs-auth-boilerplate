import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { IMigrator } from "@mikro-orm/core/typings";
import { MikroORM } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import request from "supertest";

import { AuthModule } from "../src/auth/auth.module";
import { testOrmconfig } from "../src/test-utils/testOrmconfig";
import { SignupDto } from "../src/auth/dto/signup.dto";
import { jwtRegex } from "../src/shared/regexes";
import { User } from "../src/auth/entities/user.entity";
import { parseJwt } from "../src/test-utils/parseJwt";

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

  describe("/auth/signup (POST)", () => {
    const correctSignupDto: SignupDto = { email: "s@gmail.com", username: "someone", password: "1234abcd" };

    // correct workflow
    it("should return create a user in the database as well as a cookie, and return the JWT token", async (done) => {
      request(app.getHttpServer())
        .post("/auth/signup")
        .send(correctSignupDto)
        .expect(201)
        .then(async (res) => {
          const users = await orm.em.getRepository(User).findAll();

          // user database check
          expect(users.length).toEqual(1);
          expect(users[0].username).toEqual(correctSignupDto.username);
          expect(users[0].email).toEqual(correctSignupDto.email);
          expect(users[0].hash).not.toEqual(correctSignupDto.password);

          // cookie check
          expect(res.header["set-cookie"].length).toEqual(1);

          // response check
          expect(typeof res.body).toEqual("object");
          expect(res.body.token).toMatch(jwtRegex);
          expect(parseJwt(res.body.token).id).toEqual(users[0].id);
          done();
        })
        .catch((err) => done(err));
    });
  });
});
