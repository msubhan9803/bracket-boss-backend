import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupUserManagement1725711761726 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert Modules
    await queryRunner.query(`
            INSERT INTO "module" ("name", "created_at", "updated_at") VALUES 
            ('Dashboard', NOW(), NOW()),
            ('League Management', NOW(), NOW()),
            ('Tournament Management', NOW(), NOW()),
            ('Leagues', NOW(), NOW()),
            ('Tournaments', NOW(), NOW()),
            ('Club Management', NOW(), NOW()),
            ('Invitations', NOW(), NOW()),
            ('Members', NOW(), NOW()),
            ('Customization', NOW(), NOW()),
            ('My Club', NOW(), NOW()),
            ('My Team', NOW(), NOW()),
            ('My Matches', NOW(), NOW()),
            ('Team Management', NOW(), NOW()),
            ('Court Management', NOW(), NOW()),
            ('Referral Management', NOW(), NOW()),
            ('User Management', NOW(), NOW()),
            ('Payment Management', NOW(), NOW()),
            ('System Settings', NOW(), NOW()),
            ('Reporting & Analytics', NOW(), NOW()),
            ('Score & Standings', NOW(), NOW()),
            ('Chat', NOW(), NOW()),
            ('Account Settings', NOW(), NOW()),
            ('Activity Logs / Error Logs', NOW(), NOW());
        `);

    // Insert Policies
    await queryRunner.query(`
            INSERT INTO "policy" ("name", "createdDate", "updatedDate") VALUES 
            ('Read', NOW(), NOW()),
            ('Read & Write', NOW(), NOW());
        `);

    // Insert Actions
    await queryRunner.query(`
            INSERT INTO "action" ("name", "createdDate", "updatedDate") VALUES 
            ('Read', NOW(), NOW()),
            ('Write', NOW(), NOW()),
            ('Update', NOW(), NOW()),
            ('Delete', NOW(), NOW());
        `);

    // Insert mappings for actions_policies
    await queryRunner.query(`
            INSERT INTO "actions_policies" ("actionId", "policyId")
            SELECT a.id, p.id
            FROM "action" a, "policy" p
            WHERE (a.name = 'Read' AND p.name IN ('Read', 'Read & Write'))
            OR (a.name = 'Write' AND p.name = 'Read & Write')
            OR (a.name = 'Update' AND p.name = 'Read & Write')
            OR (a.name = 'Delete' AND p.name = 'Read & Write');
        `);

    // Role-wise access for ModulePolicyRole
    await this.addRolePolicies(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Truncate actions_policies and reset identity
    await queryRunner.query(
      `TRUNCATE "actions_policies" RESTART IDENTITY CASCADE;`,
    );

    // Truncate modules_policies_roles and reset identity
    await queryRunner.query(
      `TRUNCATE "modules_policies_roles" RESTART IDENTITY CASCADE;`,
    );

    // Truncate action and reset identity
    await queryRunner.query(`TRUNCATE "action" RESTART IDENTITY CASCADE;`);

    // Truncate policy and reset identity
    await queryRunner.query(`TRUNCATE "policy" RESTART IDENTITY CASCADE;`);

    // Truncate module and reset identity
    await queryRunner.query(`TRUNCATE "module" RESTART IDENTITY CASCADE;`);
  }

  private async addRolePolicies(queryRunner: QueryRunner): Promise<void> {
    // Insert access for Super Admin
    await queryRunner.query(`
            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name NOT IN ('My Club', 'My Team', 'My Matches')
            JOIN "policy" p ON p.name = 'Read & Write'
            WHERE r.name = 'Super Admin';
        `);

    // Insert access for Club Owner
    await queryRunner.query(`
            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name NOT IN ('My Club', 'My Team', 'My Matches')
            JOIN "policy" p ON p.name = 'Read & Write'
            WHERE r.name = 'Club Owner';
        `);

    // Insert access for Player
    await queryRunner.query(`
            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name IN ('Dashboard', 'My Club', 'My Team', 'My Matches', 'Score & Standings', 'Account Settings', 'Leagues', 'Tournaments')
            JOIN "policy" p ON p.name = 'Read'
            WHERE r.name = 'Player';

            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name = 'Account Settings'
            JOIN "policy" p ON p.name = 'Read & Write'
            WHERE r.name = 'Player';
        `);

    // Insert access for Tournament Organizer
    await queryRunner.query(`
            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name IN ('Dashboard', 'My Club', 'Score & Standings')
            JOIN "policy" p ON p.name = 'Read'
            WHERE r.name = 'Tournament Organizer';

            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name IN ('Tournament Management', 'Account Settings')
            JOIN "policy" p ON p.name = 'Read & Write'
            WHERE r.name = 'Tournament Organizer';
        `);

    // Insert access for League Organizer
    await queryRunner.query(`
            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name IN ('Dashboard', 'My Club', 'Score & Standings')
            JOIN "policy" p ON p.name = 'Read'
            WHERE r.name = 'League Organizer';

            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name IN ('League Management', 'Account Settings')
            JOIN "policy" p ON p.name = 'Read & Write'
            WHERE r.name = 'League Organizer';
        `);
  }
}
