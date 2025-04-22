import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Level
        ])
    ]
})
export class LevelModule {}
