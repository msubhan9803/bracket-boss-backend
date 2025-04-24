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

  createPool(pool: PoolInputDto): Promise<Pool> {
    return this.poolRepository.save(pool);
  }
}
