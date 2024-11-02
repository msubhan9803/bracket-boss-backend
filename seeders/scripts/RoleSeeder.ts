import { DataSource } from 'typeorm';

export class RoleSeeder {
  public static async seed(dataSource: DataSource): Promise<void> {
    console.log('🌺 Running Role Seeder...');

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear the table with cascade and restart identity
      await queryRunner.query(
        `TRUNCATE TABLE "role" RESTART IDENTITY CASCADE;`,
      );

      // Insert roles
      await queryRunner.query(`
        INSERT INTO "role" ("name", "createdDate", "updatedDate") VALUES 
        ('super_admin', NOW(), NOW()),
        ('club_owner', NOW(), NOW()),
        ('player', NOW(), NOW()),
        ('tournament_organizer', NOW(), NOW()),
        ('league_organizer', NOW(), NOW())
        ON CONFLICT (name) DO NOTHING;
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
