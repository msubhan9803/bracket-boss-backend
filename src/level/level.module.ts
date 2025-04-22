import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { LevelTeam } from './entities/level-team.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Level,
            LevelTeam
        ])
    ]
})
export class LevelModule {}
