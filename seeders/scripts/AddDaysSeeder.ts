import { DataSource } from 'typeorm';
import { Day } from 'src/common/entities/day.entity';
import { DayName } from 'src/common/types/global';

export class AddDaysSeeder {
    public static async seed(dataSource: DataSource): Promise<void> {
        console.log('🌺 Running Add Days Seeder...');

        const queryRunner = dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Clear the table with cascade and restart identity
            await queryRunner.query(`
                TRUNCATE TABLE "day" RESTART IDENTITY CASCADE;
            `);

            // Insert Days
            const days = Object.values(DayName).map((dayName) => ({
                name: dayName,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await queryRunner.manager.getRepository(Day).save(days);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Error seeding days:', error);
        } finally {
            await queryRunner.release();
        }
    }
}