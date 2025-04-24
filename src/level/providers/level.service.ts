import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from '../entities/level.entity';
import { Repository } from 'typeorm';
import { LevelInputDto } from '../dtos/level-input.dto';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  createLevel(level: LevelInputDto): Promise<Level> {
    return this.levelRepository.save(level);
  }
}
