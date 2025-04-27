import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from '../entities/level.entity';
import { Repository } from 'typeorm';
import { LevelInputDto } from '../dtos/level-input.dto';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  findOneWithRelations(tournament: Tournament, relations: string[] = ['format', 'tournament', 'pools']): Promise<Level[]> {
    return this.levelRepository.find({
      where: { tournament: { id: tournament.id } },
      relations,
    });
  }

  createLevel(level: LevelInputDto): Promise<Level> {
    return this.levelRepository.save(level);
  }
}
