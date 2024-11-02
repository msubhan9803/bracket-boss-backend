import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import * as speakeasy from 'speakeasy';
import { DataSource } from 'typeorm';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: envFilePath });

export class SuperAdminSeeder {
  public static async seed(dataSource: DataSource): Promise<void> {
    console.log('🌺 Running Super Admin Seeder...');

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clear the tables with cascade and restart identities
      await queryRunner.query(
        `TRUNCATE TABLE "users_roles_clubs" RESTART IDENTITY CASCADE;`,
      );
      await queryRunner.query(
        `TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;`,
      );

      // Insert role
      await queryRunner.query(`
        INSERT INTO "role" ("name", "createdDate", "updatedDate")
        VALUES ('super_admin', NOW(), NOW())
        ON CONFLICT (name) DO NOTHING;
      `);

      const superAdminRole = await queryRunner.query(`
        SELECT id FROM "role" WHERE name = 'super_admin';
      `);

      const superAdminRoleId = superAdminRole[0].id;

      const hashedPassword = await bcrypt.hash(
        process.env.APP_SUPER_ADMIN_PASSWORD,
        10,
      );

      const otpSecret = speakeasy.generateSecret({ length: 20 }).base32;

      await queryRunner.query(`
        INSERT INTO "user" (name, email, password, "otpSecret", "isEmailVerified", created_at, updated_at)
        VALUES ('super_admin', '${process.env.APP_SUPER_ADMIN_EMAIL}', '${hashedPassword}', '${otpSecret}', '${true}', NOW(), NOW())
        ON CONFLICT (email) DO NOTHING;
      `);

      const superAdminUser = await queryRunner.query(`
        SELECT id FROM "user" WHERE email = '${process.env.APP_SUPER_ADMIN_EMAIL}';
      `);

      const superAdminUserId = superAdminUser[0].id;

      await queryRunner.query(`
        INSERT INTO "users_roles_clubs" ("roleId", "userId", "clubId", created_at, updated_at)
        VALUES ('${superAdminRoleId}', '${superAdminUserId}', NULL, NOW(), NOW())
        ON CONFLICT DO NOTHING;
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
