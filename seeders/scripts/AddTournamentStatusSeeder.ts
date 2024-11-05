import { TournamentStatusTypes } from 'src/tournament-management/types/common';
import { DataSource } from 'typeorm';

export class AddTournamentStatusSeeder {
  public static async seed(dataSource: DataSource): Promise<void> {
    console.log('🌺 Running Add Tournament Status Seeder...');

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear the TournamentStatus table with cascade and restart identity
      await queryRunner.query(`
        TRUNCATE TABLE "tournament_status" RESTART IDENTITY CASCADE;
      `);

      // Insert Tournament Statuses
      await queryRunner.query(`
        INSERT INTO "tournament_status" ("status", "created_at", "updated_at") VALUES
        ('${TournamentStatusTypes.not_started}', NOW(), NOW()),
        ('${TournamentStatusTypes.in_progress}', NOW(), NOW()),
        ('${TournamentStatusTypes.completed}', NOW(), NOW());
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
