import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Round } from '../entities/round.entity';
import { Repository } from 'typeorm';
import { RoundInputDto } from '../dtos/round-input.dto';

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
      relations
    })
  }
}
