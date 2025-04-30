import { Args, Query, Resolver } from '@nestjs/graphql';
import { MatchService } from './providers/match.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { Match } from './entities/match.entity';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';

@Resolver()
export class MatchManagementResolver {
    constructor(private readonly matchService: MatchService) { }

    @UseGuards(AuthCheckGuard)
    @Query(() => [Match])
    async getMatchesByRoundId(@Args('roundId') roundId: number) {
        try {
            const matches = await this.matchService.findMatchesByRoundId(roundId);
            return matches;
        } catch (error) {
            throw new InternalServerErrorException('Error: ', error.message)
        }
    }
}
