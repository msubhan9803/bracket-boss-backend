import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoleNameToEnum1739386800606 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the ENUM type in PostgreSQL
        await queryRunner.query(`
            CREATE TYPE "role_name_enum" AS ENUM (
                'super_admin', 
                'club_owner', 
                'player', 
                'organizer'
            )
        `);

        // Alter the existing column to use ENUM type
        await queryRunner.query(`
            ALTER TABLE "role" 
            ALTER COLUMN "name" TYPE "role_name_enum" 
            USING "name"::text::"role_name_enum"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert back to text type
        await queryRunner.query(`
            ALTER TABLE "role" 
            ALTER COLUMN "name" TYPE text 
            USING "name"::text
        `);

        // Drop ENUM type
        await queryRunner.query(`DROP TYPE "role_name_enum"`);
    }

}
