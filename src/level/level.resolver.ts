import { Args, Query, Resolver } from '@nestjs/graphql';
import { LevelService } from './providers/level.service';
import { TournamentManagementService } from 'src/tournament-management/providers/tournament-management.service';
import { Level } from './entities/level.entity';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { LevelTeamStandingService } from './providers/level-team-standing.service';
import { LevelTeamStanding } from './entities/levelStandings.entity';

@Resolver()
export class LevelResolver {
  constructor(
    private readonly tournamentService: TournamentManagementService,
    private readonly levelService: LevelService,
    private readonly levelTeamStandingService: LevelTeamStandingService,
  ) {}

  @UseGuards(AuthCheckGuard)
  @Query(() => [Level])
  async getLevelsByTournament(@Args('tournamentId') tournamentId: number) {
    try {
      const tournament = await this.tournamentService.findOne(tournamentId);
      const levels = await this.levelService.findAllByTournamentWithRelations(tournament);

      return levels;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Query(() => [LevelTeamStanding])
  async getLevelTeamStandingsByLevelId(@Args('levelId') levelId: number) {
    try {
      const levelTeamStandings = await this.levelTeamStandingService.findAllByLevelId(levelId);

      return levelTeamStandings;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
