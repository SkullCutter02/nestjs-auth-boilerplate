import {MigrationInterface, QueryRunner} from "typeorm";

export class createEmailSchema1624975046524 implements MigrationInterface {
    name = 'createEmailSchema1624975046524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reset_emails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, "token" character varying NOT NULL, "expirationDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_577c891b7eae4d6b5bf34a4dc5b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "reset_emails"`);
    }

}
