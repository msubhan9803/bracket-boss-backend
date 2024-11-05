import { TournamentRoundStatusTypes } from 'src/tournament-management/types/common';
import { DataSource } from 'typeorm';

export class AddTournamentRoundStatusSeeder {
  public static async seed(dataSource: DataSource): Promise<void> {
    console.log('🌺 Running Add Tournament Round Status Seeder...');

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear the TournamentRoundStatus table with cascade and restart identity
      await queryRunner.query(`
        TRUNCATE TABLE "tournament_round_status" RESTART IDENTITY CASCADE;
      `);

      // Insert Tournament Round Statuses
      await queryRunner.query(`
        INSERT INTO "tournament_round_status" ("status", "created_at", "updated_at") VALUES
        ('${TournamentRoundStatusTypes.not_started}', NOW(), NOW()),
        ('${TournamentRoundStatusTypes.in_progress}', NOW(), NOW()),
        ('${TournamentRoundStatusTypes.completed}', NOW(), NOW());
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
