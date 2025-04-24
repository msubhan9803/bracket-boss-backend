import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { LevelTeam } from './entities/level-team.entity';
import { LevelTeamStanding } from './entities/levelStandings.entity';
import { LevelService } from './providers/level.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Level,
            LevelTeam,
            LevelTeamStanding
        ])
    ],
    providers: [LevelService],
    exports: [LevelService]
})
export class LevelModule {}
