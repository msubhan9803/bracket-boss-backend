import { DataSource } from 'typeorm';

export class AddPickleballSportSeeder {
  public static async seed(dataSource: DataSource): Promise<void> {
    console.log('🌺 Running Add Pickleball Sport Seeder...');

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear tables with cascade and restart identity
      await queryRunner.query(`
        TRUNCATE TABLE "sport" RESTART IDENTITY CASCADE;
      `);

      await queryRunner.query(`
        INSERT INTO "sport" ("name", "description", "created_at", "updated_at") VALUES
        ('pickleball', 'A paddleball sport that combines elements of badminton, table tennis, and tennis.', NOW(), NOW());
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
