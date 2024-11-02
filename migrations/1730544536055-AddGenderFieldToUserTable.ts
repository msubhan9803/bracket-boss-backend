import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGenderFieldToUserTable1730544536055
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN "gender" VARCHAR;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      DROP COLUMN "gender";
    `);
  }
}
