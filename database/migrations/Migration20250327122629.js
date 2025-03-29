'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20250327122629 extends Migration {

  async up() {
    this.addSql(`alter table "punishment" alter column "duration" type int using ("duration"::int);`);
  }

  async down() {
    this.addSql(`alter table "punishment" alter column "duration" type varchar(255) using ("duration"::varchar(255));`);
  }

}
exports.Migration20250327122629 = Migration20250327122629;
