import { DataSource } from 'typeorm';

export class OnboardingStepsSeeder {
  public static async seed(dataSource: DataSource): Promise<void> {
    console.log('🌺 Running Onboarding Steps Seeder...');

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear tables with cascade and restart identity
      await queryRunner.query(`
        TRUNCATE TABLE "step" RESTART IDENTITY CASCADE;
        TRUNCATE TABLE "roles_steps" RESTART IDENTITY CASCADE;
      `);

      await queryRunner.query(
        `SELECT setval(pg_get_serial_sequence('step', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "step";`,
      );

      await queryRunner.query(`
        INSERT INTO "step" ("name", "createdDate", "updatedDate") VALUES
        ('registration', NOW(), NOW()),
        ('email_verification', NOW(), NOW()),
        ('user_type_selection', NOW(), NOW()),
        ('club_information_insertion', NOW(), NOW()),
        ('club_selection', NOW(), NOW());
      `);

      const steps = await queryRunner.query(`
        SELECT id, name FROM "step" WHERE name IN 
        ('registration', 'email_verification', 'user_type_selection', 'club_information_insertion', 'club_selection');
      `);

      const stepMap = steps.reduce((map, step) => {
        map[step.name] = step.id;
        return map;
      }, {});

      await queryRunner.query(`
        INSERT INTO "roles_steps" ("roleId", "stepId") VALUES
        (2, ${stepMap['registration']}),
        (2, ${stepMap['email_verification']}),
        (2, ${stepMap['user_type_selection']}),
        (2, ${stepMap['club_information_insertion']});
      `);

      await queryRunner.query(`
        INSERT INTO "roles_steps" ("roleId", "stepId") VALUES
        (3, ${stepMap['registration']}),
        (3, ${stepMap['email_verification']}),
        (3, ${stepMap['user_type_selection']}),
        (3, ${stepMap['club_selection']});
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
