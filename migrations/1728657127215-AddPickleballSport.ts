import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPickleballSport1728657127215 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO "sport" ("name", "description", "created_at", "updated_at") VALUES
          ('pickleball', 'A paddleball sport that combines elements of badminton, table tennis, and tennis.', NOW(), NOW());
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM "sport" WHERE "name" = 'pickleball';
        `);
  }
}
