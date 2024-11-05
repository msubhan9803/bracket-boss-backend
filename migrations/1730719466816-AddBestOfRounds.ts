import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBestOfRounds1730719466816 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tournament" ADD "bestOfRounds" integer DEFAULT 1;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tournament" DROP COLUMN "bestOfRounds";
          `);
  }
}
