import { DataSource } from 'typeorm';

export class AddFormatsAndTeamGenerationTypesSeeder {
  public static async seed(dataSource: DataSource): Promise<void> {
    console.log('🌺 Running Add Formats & Team Generation Types Seeder...');

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear tables with cascade and restart identity
      await queryRunner.query(`
        TRUNCATE TABLE "format" RESTART IDENTITY CASCADE;
        TRUNCATE TABLE "team_generation_type" RESTART IDENTITY CASCADE;
        TRUNCATE TABLE "format_team_generation_types" RESTART IDENTITY CASCADE;
      `);

      // Insert Formats
      await queryRunner.query(`
        INSERT INTO "format" ("name", "created_at", "updated_at") VALUES
        ('round_robin', NOW(), NOW()),
        ('single_elimination', NOW(), NOW()),
        ('double_elimination', NOW(), NOW());
      `);

      // Insert Team Generation Types
      await queryRunner.query(`
        INSERT INTO "team_generation_type" ("name", "created_at", "updated_at") VALUES
        ('blind_draw', NOW(), NOW()),
        ('split_switch', NOW(), NOW());
      `);

      // Insert Relationships
      await queryRunner.query(`
        INSERT INTO "format_team_generation_types" ("formatId", "teamGenerationTypeId") 
        SELECT f.id, t.id
        FROM "format" f, "team_generation_type" t
        WHERE (f.name = 'round_robin' AND t.name = 'blind_draw')
        OR (f.name = 'round_robin' AND t.name = 'split_switch');
      `);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
