import { DataSource } from 'typeorm';
import { TimeSlots } from 'src/common/entities/time.entity';

export class AddTimeSlotsSeeder {
    public static async seed(dataSource: DataSource): Promise<void> {
        console.log('🌺 Running Add Time Slots Seeder...');

        const queryRunner = dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Clear the table with cascade and restart identity
            await queryRunner.query(`
                TRUNCATE TABLE "time_slots" RESTART IDENTITY CASCADE;
            `);

            // Insert Time Slots with 1-hour difference
            const timeSlots = [];
            for (let hour = 0; hour < 24; hour++) {
                const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
                const endTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
                timeSlots.push({
                    startTime,
                    endTime,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }

            await queryRunner.manager.getRepository(TimeSlots).save(timeSlots);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error seeding time slots:', error);
        } finally {
            await queryRunner.release();
        }
    }
}