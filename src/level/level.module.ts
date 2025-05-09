import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { LevelTeam } from './entities/level-team.entity';
import { LevelTeamStanding } from './entities/levelStandings.entity';
import { LevelService } from './providers/level.service';
import { LevelResolver } from './level.resolver';
import { TournamentManagementModule } from 'src/tournament-management/tournament-management.module';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { LevelTeamStandingService } from './providers/level-team-standing.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Level,
            LevelTeam,
            LevelTeamStanding
        ]),
        UsersModule,
        forwardRef(() => TournamentManagementModule),
    ],
    providers: [LevelService, LevelResolver, JwtService, LevelTeamStandingService],
    exports: [LevelService, LevelTeamStandingService]
})
export class LevelModule { }
