import { Migration } from '@mikro-orm/migrations';

export class Migration20210208114638 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_name" text not null, "email" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_user_name_unique" unique ("user_name");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
  }

}
