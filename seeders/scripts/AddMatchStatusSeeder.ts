import { MatchStatusTypes } from 'src/match-management/types/common';
import { DataSource } from 'typeorm';

export class AddMatchStatusSeeder {
  public static async seed(dataSource: DataSource): Promise<void> {
    console.log('🌺 Running Add Match Status Seeder...');

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear the MatchStatus table with cascade and restart identity
      await queryRunner.query(`
        TRUNCATE TABLE "match_status" RESTART IDENTITY CASCADE;
      `);

      // Insert Match Statuses
      await queryRunner.query(`
        INSERT INTO "match_status" ("status", "created_at", "updated_at") VALUES
        ('${MatchStatusTypes.not_started}', NOW(), NOW()),
        ('${MatchStatusTypes.in_progress}', NOW(), NOW()),
        ('${MatchStatusTypes.void}', NOW(), NOW()),
        ('${MatchStatusTypes.paused}', NOW(), NOW()),
        ('${MatchStatusTypes.completed}', NOW(), NOW());
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
