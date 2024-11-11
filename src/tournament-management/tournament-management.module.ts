import { Module } from '@nestjs/common';
import { TournamentManagementService } from './providers/tournament-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { TournamentManagementResolver } from './tournament-management.resolver';
import { SportManagementModule } from 'src/sport-management/sport-management.module';
import { FormatManagementModule } from 'src/format-management/format-management.module';
import { ClubsModule } from 'src/clubs/clubs.module';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { TeamGenerationTypeManagementModule } from 'src/team-generation-type-management/team-generation-type-management.module';
import { TournamentStatus } from './entities/tournamentStatus.entity';
import { TournamentRound } from './entities/tournamentRound.entity';
import { TournamentRoundStatus } from './entities/tournamentRoundStatus.entity';
import { TournamentRoundService } from './providers/tournament-round.service';
import { TournamentRoundStatusService } from './providers/tournament-round-status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tournament,
      TournamentStatus,
      TournamentRound,
      TournamentRoundStatus,
    ]),
    SportManagementModule,
    FormatManagementModule,
    ClubsModule,
    UsersModule,
    TeamGenerationTypeManagementModule,
  ],
  providers: [
    TournamentManagementService,
    TournamentManagementResolver,
    JwtService,
    TournamentRoundService,
    TournamentRoundStatusService
  ],
  exports: [TournamentManagementService, TournamentRoundService],
})
export class TournamentManagementModule {}
