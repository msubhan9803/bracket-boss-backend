import { Args, Query, Resolver } from '@nestjs/graphql';
import { RoundService } from './providers/round.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { Pool } from 'src/pool/entities/pool.entity';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';

@Resolver()
export class RoundResolver {
    constructor(private readonly roundService: RoundService) { }

    @UseGuards(AuthCheckGuard)
    @Query(() => [Pool])
    async getRoundsByPoolId(@Args('poolId') poolId: number) {
        try {
            const rounds = await this.roundService.findRoundsByPoolId(poolId);
            return rounds;
        } catch (error) {
            throw new InternalServerErrorException('Error: ', error.message)
        }
    }
 }
