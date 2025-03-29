'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20250327123546 extends Migration {

  async up() {
    this.addSql(`alter table "punishment" alter column "duration" type bigint using ("duration"::bigint);`);
  }

  async down() {
    this.addSql(`alter table "punishment" alter column "duration" type int using ("duration"::int);`);
  }

}
exports.Migration20250327123546 = Migration20250327123546;
