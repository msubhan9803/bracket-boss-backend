import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import * as speakeasy from 'speakeasy';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: envFilePath });

export class SuperAdminCreation1725706999572 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create a super admin role if it doesn't already exist
    await queryRunner.query(`
      INSERT INTO "role" ("name", "createdDate", "updatedDate")
      VALUES ('Super Admin', NOW(), NOW())
      ON CONFLICT (name) DO NOTHING;
    `);

    // Fetch the Super Admin role ID
    const superAdminRole = await queryRunner.query(`
      SELECT id FROM "role" WHERE name = 'Super Admin';
    `);

    const superAdminRoleId = superAdminRole[0].id;

    // Hash password
    const hashedPassword = await bcrypt.hash(
      process.env.APP_SUPER_ADMIN_PASSWORD,
      10,
    );

    const otpSecret = speakeasy.generateSecret({ length: 20 }).base32;

    // Insert a super admin user
    await queryRunner.query(`
      INSERT INTO "user" (name, email, password, "otpSecret", "isEmailVerified", created_at, updated_at)
      VALUES ('Super Admin', '${process.env.APP_SUPER_ADMIN_EMAIL}', '${hashedPassword}', '${otpSecret}', '${false}', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING;
    `);

    // Fetch the newly created super admin user ID
    const superAdminUser = await queryRunner.query(`
      SELECT id FROM "user" WHERE email = '${process.env.APP_SUPER_ADMIN_EMAIL}';
    `);

    const superAdminUserId = superAdminUser[0].id;

    // Assign the super admin role to the super admin user
    await queryRunner.query(`
      INSERT INTO "roles_users" ("roleId", "userId")
      VALUES ('${superAdminRoleId}', '${superAdminUserId}')
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "roles_users" WHERE "userId" IN (
        SELECT id FROM public.user WHERE email = '${process.env.APP_SUPER_ADMIN_EMAIL}'
      );
    `);

    await queryRunner.query(`
      DELETE FROM "user" WHERE "email" = '${process.env.APP_SUPER_ADMIN_EMAIL}';
    `);
  }
}
