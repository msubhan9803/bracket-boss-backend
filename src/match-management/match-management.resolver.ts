import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MatchService } from './providers/match.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { Match } from './entities/match.entity';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { FilterMatchesInputDto } from './dtos/filter-matches-input.dto';
import { MatchRoundScore } from './entities/matchRoundScore.entity';
import { MatchRoundService } from './providers/match-round.service';
import { MatchRoundScoreService } from './providers/match-round-score.service';
import { MatchRound } from './entities/matchRound.entity';
import { UpdateMatchScoreInputDto } from './dtos/update-match-score-input.dto';

@Resolver()
export class MatchManagementResolver {
  constructor(
    private readonly matchService: MatchService,
    private readonly matchRoundService: MatchRoundService,
    private readonly matchRoundScoreService: MatchRoundScoreService
  ) { }

  @UseGuards(AuthCheckGuard)
  @Query(() => Match)
  async getMatchByMatchId(@Args('matchId') matchId: number) {
    try {
      return this.matchService.findMatchById(matchId);
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Query(() => [Match])
  async getMatchesByRoundId(@Args('roundId') roundId: number) {
    try {
      const matches = await this.matchService.findMatchesByRoundId(roundId);
      return matches;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Query(() => [Match])
  async getAllMatchesWithFilters(@Args('input') filters: FilterMatchesInputDto): Promise<Match[]> {
    try {
      const matches = await this.matchService.findAllWithFilters(filters);
      return matches;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching matches with filters: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => Match)
  async startMatch(@Args('matchId') matchId: number): Promise<Match> {
    try {
      const updatedMatch = await this.matchService.startMatch(matchId);
      return updatedMatch;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => MatchRoundScore)
  async updateScore(@Args('input') updateMatchScoreInputDto: UpdateMatchScoreInputDto) {
    try {
      const { matchId, roundId, homeTeamScore, awayTeamScore } = updateMatchScoreInputDto;
      const matchRound = await this.matchRoundService.findMatchRoundById(roundId);

      if (matchRound.match.id !== matchId) {
        throw new Error('Round does not belong to the specified match');
      }

      return this.matchRoundScoreService.updateScore(
        matchRound.id,
        homeTeamScore,
        awayTeamScore
      );
    } catch (error) {
      throw new InternalServerErrorException('Error updating score: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => MatchRound)
  async endMatchRound(
    @Args('matchId') matchId: number,
    @Args('roundId') roundId: number
  ) {
    try {
      const matchRound = await this.matchRoundService.findMatchRoundById(roundId);

      if (matchRound.match.id !== matchId) {
        throw new Error('Round does not belong to the specified match');
      }

      return this.matchRoundService.endMatchRound(roundId);
    } catch (error) {
      throw new InternalServerErrorException('Error ending match round: ', error.message);
    }
  }
}
