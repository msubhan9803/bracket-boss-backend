import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Round } from '../entities/round.entity';
import { Repository } from 'typeorm';
import { RoundInputDto } from '../dtos/round-input.dto';
import { RoundStatusTypesEnum } from '../types/common';

@Injectable()
export class RoundService {
  constructor(
    @InjectRepository(Round)
    private roundRepository: Repository<Round>,
  ) {}

  createRound(round: RoundInputDto) {
    return this.roundRepository.save(round);
  }

  findRoundsByPoolId(poolId: number, relations: string[] = ['matches']): Promise<Round[]> {
    return this.roundRepository.find({
      where: { pool: { id: poolId } },
      order: { order: 'ASC' },
      relations
    })
  }

  findInProgressRoundByPoolId(poolId: number, relations: string[] = ['matches']): Promise<Round> {
    return this.roundRepository.findOne({
      where: { 
        pool: { id: poolId },
        status: RoundStatusTypesEnum.in_progress
      },
      relations
    });
  }

  async updateRoundStatus(roundId: number, status: RoundStatusTypesEnum): Promise<Round> {
    await this.roundRepository.update(roundId, { status });
    return this.roundRepository.findOne({ where: { id: roundId }, relations: ['matches'] });
  }
}
