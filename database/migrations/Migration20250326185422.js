'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20250326185422 extends Migration {

  async up() {
    this.addSql(`create table "data" ("key" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "value" varchar(255) not null default '', constraint "data_pkey" primary key ("key"));`);

    this.addSql(`create table "guild" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "prefix" varchar(255) null, "deleted" boolean not null default false, "last_interact" timestamptz not null, constraint "guild_pkey" primary key ("id"));`);

    this.addSql(`create table "image" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "file_name" varchar(255) not null, "base_path" varchar(255) not null default '', "url" varchar(255) not null, "size" int not null, "tags" text[] not null, "hash" varchar(255) not null, "delete_hash" varchar(255) not null);`);

    this.addSql(`create table "pastebin" ("id" varchar(255) not null, "edit_code" varchar(255) not null, "lifetime" int not null default -1, "created_at" timestamptz not null, constraint "pastebin_pkey" primary key ("id"));`);

    this.addSql(`create table "stat" ("id" serial primary key, "type" varchar(255) not null, "value" varchar(255) not null default '', "additional_data" jsonb null, "created_at" timestamptz not null);`);

    this.addSql(`create table "user" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "last_interact" timestamptz not null, constraint "user_pkey" primary key ("id"));`);
  }

}
exports.Migration20250326185422 = Migration20250326185422;
