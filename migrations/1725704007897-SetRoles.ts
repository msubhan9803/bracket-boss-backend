import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetRoles1725704007897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Reset the sequence of the primary key (assuming the primary key is 'id')
    await queryRunner.query(
      `SELECT setval(pg_get_serial_sequence('role', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "role";`,
    );

    // Predefined roles into the 'role' table
    await queryRunner.query(`
            INSERT INTO "role" ("name", "createdDate", "updatedDate") VALUES 
            ('Super Admin', NOW(), NOW()),
            ('Club Owner', NOW(), NOW()),
            ('Player', NOW(), NOW()),
            ('Tournament Organizer', NOW(), NOW()),
            ('League Organizer', NOW(), NOW());
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove Predefined roles from the 'role' table
    await queryRunner.query(`
            DELETE FROM "role" WHERE "name" IN ('Super Admin', 'Club Owner', 'Player', 'Tournament Organizer', 'League Organizer');
        `);
  }
}
