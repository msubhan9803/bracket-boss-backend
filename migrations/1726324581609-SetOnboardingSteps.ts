import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetOnboardingSteps1726324581609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Reset the sequence of the primary key for the step table
    await queryRunner.query(
      `SELECT setval(pg_get_serial_sequence('step', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "step";`,
    );

    // Predefined steps into the 'step' table
    await queryRunner.query(`
      INSERT INTO "step" ("name", "createdDate", "updatedDate") VALUES
      ('registration', NOW(), NOW()),
      ('email_verification', NOW(), NOW()),
      ('user_type_selection', NOW(), NOW()),
      ('club_information_insertion', NOW(), NOW()),
      ('club_selection', NOW(), NOW());
    `);

    // Retrieve step IDs
    const steps = await queryRunner.query(`
      SELECT id, name FROM "step" WHERE name IN 
      ('registration', 'email_verification', 'user_type_selection', 'club_information_insertion', 'club_selection');
    `);

    // Map step names to their IDs for easy lookup
    const stepMap = steps.reduce((map, step) => {
      map[step.name] = step.id;
      return map;
    }, {});

    // Insert role to step mappings for Club Owner (role 2)
    await queryRunner.query(`
      INSERT INTO "roles_steps" ("roleId", "stepId") VALUES
      (2, ${stepMap['registration']}),
      (2, ${stepMap['email_verification']}),
      (2, ${stepMap['user_type_selection']}),
      (2, ${stepMap['club_information_insertion']});
    `);

    // Insert role to step mappings for Player (role 3)
    await queryRunner.query(`
      INSERT INTO "roles_steps" ("roleId", "stepId") VALUES
      (3, ${stepMap['registration']}),
      (3, ${stepMap['email_verification']}),
      (3, ${stepMap['user_type_selection']}),
      (3, ${stepMap['club_selection']});
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Truncate the 'step' table to remove predefined steps
    await queryRunner.query(`
      TRUNCATE TABLE "roles_steps" RESTART IDENTITY CASCADE;
      TRUNCATE TABLE "step" RESTART IDENTITY CASCADE;
    `);
  }
}
