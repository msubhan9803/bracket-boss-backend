import { Injectable } from '@nestjs/common';
import { Pool } from '../entities/pool.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PoolInputDto } from '../dtos/pool-input.dto';

@Injectable()
export class PoolService {
  constructor(
    @InjectRepository(Pool)
    private poolRepository: Repository<Pool>,
  ) {}

  getPoolById(poolId: number, relations: string[] = ['rounds', 'tournament', 'level']): Promise<Pool> {
    return this.poolRepository.findOne({
      where: { id: poolId },
      relations,
    });
  }

  getPoolsByLevelId(levelId: number, relations: string[] = ['rounds']): Promise<Pool[]> {
    return this.poolRepository.find({
      where: { level: { id: levelId } },
      relations,
    });
  }

  createPool(pool: PoolInputDto): Promise<Pool> {
    return this.poolRepository.save(pool);
  }
}
