import { Args, Query, Resolver } from '@nestjs/graphql';
import { PoolService } from './providers/pool.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { Pool } from './entities/pool.entity';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';

@Resolver()
export class PoolResolver {
    constructor(
        private readonly poolService: PoolService,
    ) { }

    @UseGuards(AuthCheckGuard)
    @Query(() => [Pool])
    async getPoolsByLevel(@Args('levelId') levelId: number) {
        try {
            const pools = await this.poolService.getPoolsByLevelId(levelId);
            return pools;
        } catch (error) {
            throw new InternalServerErrorException('Error: ', error.message)
        }
    }
}
