import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupUserManagement1725711761726 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert Modules
    await queryRunner.query(`
            INSERT INTO "module" ("name", "created_at", "updated_at") VALUES 
            ('dashboard', NOW(), NOW()),
            ('league_management', NOW(), NOW()),
            ('tournament_management', NOW(), NOW()),
            ('leagues', NOW(), NOW()),
            ('tournaments', NOW(), NOW()),
            ('club_management', NOW(), NOW()),
            ('invitations', NOW(), NOW()),
            ('members', NOW(), NOW()),
            ('customization', NOW(), NOW()),
            ('my_club', NOW(), NOW()),
            ('my_team', NOW(), NOW()),
            ('my_matches', NOW(), NOW()),
            ('team_management', NOW(), NOW()),
            ('court_management', NOW(), NOW()),
            ('referral_management', NOW(), NOW()),
            ('user_management', NOW(), NOW()),
            ('payment_management', NOW(), NOW()),
            ('system_settings', NOW(), NOW()),
            ('reporting_&_analytics', NOW(), NOW()),
            ('scheduling', NOW(), NOW()),
            ('chat', NOW(), NOW()),
            ('account_settings', NOW(), NOW()),
            ('activity_logs', NOW(), NOW());
        `);

    // Insert Policies
    await queryRunner.query(`
            INSERT INTO "policy" ("name", "createdDate", "updatedDate") VALUES 
            ('read', NOW(), NOW()),
            ('read_&_write', NOW(), NOW());
        `);

    // Insert Actions
    await queryRunner.query(`
            INSERT INTO "action" ("name", "createdDate", "updatedDate") VALUES 
            ('read', NOW(), NOW()),
            ('write', NOW(), NOW()),
            ('update', NOW(), NOW()),
            ('delete', NOW(), NOW());
        `);

    // Insert mappings for actions_policies
    await queryRunner.query(`
            INSERT INTO "actions_policies" ("actionId", "policyId")
            SELECT a.id, p.id
            FROM "action" a, "policy" p
            WHERE (a.name = 'read' AND p.name IN ('read', 'read_&_write'))
            OR (a.name = 'write' AND p.name = 'read_&_write')
            OR (a.name = 'update' AND p.name = 'read_&_write')
            OR (a.name = 'delete' AND p.name = 'read_&_write');
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
            JOIN "module" m ON m.name NOT IN ('my_club', 'my_team', 'my_matches')
            JOIN "policy" p ON p.name = 'read_&_write'
            WHERE r.name = 'super_admin';
        `);

    // Insert access for Club Owner
    await queryRunner.query(`
            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name NOT IN ('my_club', 'my_team', 'my_matches')
            JOIN "policy" p ON p.name = 'read_&_write'
            WHERE r.name = 'club_owner';
        `);

    // Insert access for Player
    await queryRunner.query(`
            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name IN ('dashboard', 'my_club', 'my_team', 'my_matches', 'scheduling', 'account_settings', 'leagues', 'tournaments')
            JOIN "policy" p ON p.name = 'read'
            WHERE r.name = 'player';
        `);

    // Insert access for Tournament Organizer
    await queryRunner.query(`
            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name IN ('dashboard', 'my_club', 'scheduling')
            JOIN "policy" p ON p.name = 'read'
            WHERE r.name = 'tournament_organizer';

            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name IN ('tournament_management', 'account_settings')
            JOIN "policy" p ON p.name = 'read_&_write'
            WHERE r.name = 'tournament_organizer';
        `);

    // Insert access for League Organizer
    await queryRunner.query(`
            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name IN ('dashboard', 'my_club', 'scheduling')
            JOIN "policy" p ON p.name = 'read'
            WHERE r.name = 'league_organizer';

            INSERT INTO "modules_policies_roles" ("roleId", "moduleId", "policyId", "created_at", "updated_at")
            SELECT r.id, m.id, p.id, NOW(), NOW()
            FROM "role" r
            JOIN "module" m ON m.name IN ('league_management', 'account_settings')
            JOIN "policy" p ON p.name = 'read_&_write'
            WHERE r.name = 'league_organizer';
        `);
  }
}
