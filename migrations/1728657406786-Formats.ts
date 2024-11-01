import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFormats1728657406786 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO "format" ("name", "created_at", "updated_at") VALUES
          ('round_robin', NOW(), NOW()),
          ('single_elimination', NOW(), NOW()),
          ('double_elimination', NOW(), NOW());
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM "format" WHERE "name" IN ('round_robin', 'single_elimination', 'double_elimination');
        `);
  }
}
