import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDaysTimeSlotsCourtScheduleMatchAssignmentsTables1736154108976 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "day" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "time_slots" (
                "id" SERIAL PRIMARY KEY,
                "startTime" TIME NOT NULL,
                "endTime" TIME NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "court_schedule" (
                "id" SERIAL PRIMARY KEY,
                "courtId" INTEGER NOT NULL,
                "dayId" INTEGER NOT NULL,
                "timeSlotId" INTEGER NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT "FK_court" FOREIGN KEY ("courtId") REFERENCES "court"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_day" FOREIGN KEY ("dayId") REFERENCES "day"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_timeSlot" FOREIGN KEY ("timeSlotId") REFERENCES "time_slots"("id") ON DELETE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "match_court_assignments" (
                "id" SERIAL PRIMARY KEY,
                "courtId" INTEGER NOT NULL,
                "matchId" INTEGER NOT NULL,
                "courtScheduleId" INTEGER NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT "FK_court_assignment" FOREIGN KEY ("courtId") REFERENCES "court"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_match" FOREIGN KEY ("matchId") REFERENCES "match"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_court_schedule" FOREIGN KEY ("courtScheduleId") REFERENCES "court_schedule"("id") ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "match_court_assignments";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "court_schedule";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "time_slots";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "day";`);
    }
}