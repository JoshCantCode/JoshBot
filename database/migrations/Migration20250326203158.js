'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20250326203158 extends Migration {

  async up() {
    this.addSql(`create table "punishment" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "reason" varchar(255) not null default 'Being an asshole', "user_id" varchar(255) not null, "guild_id" varchar(255) not null, "moderator" varchar(255) not null, "active" boolean not null default true, "duration" varchar(255) null, "type" varchar(255) not null, constraint "punishment_pkey" primary key ("id"));`);
  }

  async down() {
    this.addSql(`drop table if exists "punishment" cascade;`);
  }

}
exports.Migration20250326203158 = Migration20250326203158;
