import { Migration } from "@mikro-orm/migrations";

export class Migration20210701022700 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "users" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "email" varchar(255) not null, "hash" varchar(255) not null);',
    );
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');

    this.addSql(
      'create table "reset_emails" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" varchar(255) not null, "token" varchar(255) not null, "expiration_date" timestamptz(0) not null);',
    );
    this.addSql('alter table "reset_emails" add constraint "reset_emails_pkey" primary key ("id");');
  }

  async down(): Promise<void> {
    this.addSql('drop table "users"');
    this.addSql('drop table "reset_emails"');
  }
}
