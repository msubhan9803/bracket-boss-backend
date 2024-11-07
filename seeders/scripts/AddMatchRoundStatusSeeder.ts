import { MatchRoundStatusTypes } from 'src/match-management/types/common';
import { DataSource } from 'typeorm';

export class AddMatchRoundStatusSeeder {
  public static async seed(dataSource: DataSource): Promise<void> {
    console.log('🌺 Running Add Match Round Status Seeder...');

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear the MatchRoundStatus table with cascade and restart identity
      await queryRunner.query(`
        TRUNCATE TABLE "match_round_status" RESTART IDENTITY CASCADE;
      `);

      // Insert Match Round Statuses
      await queryRunner.query(`
        INSERT INTO "match_round_status" ("status", "created_at", "updated_at") VALUES
        ('${MatchRoundStatusTypes.not_started}', NOW(), NOW()),
        ('${MatchRoundStatusTypes.in_progress}', NOW(), NOW()),
        ('${MatchRoundStatusTypes.void}', NOW(), NOW()),
        ('${MatchRoundStatusTypes.paused}', NOW(), NOW()),
        ('${MatchRoundStatusTypes.completed}', NOW(), NOW());
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
