import { TeamStatusTypes } from 'src/team-management/types/common';
import { DataSource } from 'typeorm';

export class AddTeamStatusSeeder {
  public static async seed(dataSource: DataSource): Promise<void> {
    console.log('🌺 Running Add Team Status Seeder...');

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear the TeamStatus table with cascade and restart identity
      await queryRunner.query(`
        TRUNCATE TABLE "team_status" RESTART IDENTITY CASCADE;
      `);

      // Insert Team Statuses
      await queryRunner.query(`
        INSERT INTO "team_status" ("status", "created_at", "updated_at") VALUES
        ('${TeamStatusTypes.not_assigned}', NOW(), NOW()),
        ('${TeamStatusTypes.registered}', NOW(), NOW()),
        ('${TeamStatusTypes.idle}', NOW(), NOW()),
        ('${TeamStatusTypes.coming_up}', NOW(), NOW()),
        ('${TeamStatusTypes.playing}', NOW(), NOW()),
        ('${TeamStatusTypes.disqualified}', NOW(), NOW()),
        ('${TeamStatusTypes.forfeited}', NOW(), NOW()),
        ('${TeamStatusTypes.eliminated}', NOW(), NOW()),
        ('${TeamStatusTypes.withdrawn}', NOW(), NOW()),
        ('${TeamStatusTypes.bye}', NOW(), NOW()),
        ('${TeamStatusTypes.waiting_list}', NOW(), NOW()),
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
