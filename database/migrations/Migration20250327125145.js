'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20250327125145 extends Migration {

  async up() {
    this.addSql(`alter table "user" add column "name" varchar(255) not null;`);
  }

  async down() {
    this.addSql(`alter table "user" drop column "name";`);
  }

}
exports.Migration20250327125145 = Migration20250327125145;
