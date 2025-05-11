import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from '../entities/level.entity';
import { FindOptionsOrder, Repository, UpdateResult } from 'typeorm';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  findOne(levelId: number, relations: string[] = ['format', 'tournament', 'pools']): Promise<Level> {
    return this.levelRepository.findOne({
      where: { id: levelId },
      relations
    });
  }

  findAllByTournamentWithRelations(
    tournament: Tournament, 
    relations: string[] = ['format', 'tournament', 'pools'],
    order: FindOptionsOrder<Level> = { order: "ASC" }
  ): Promise<Level[]> {
    return this.levelRepository.find({
      where: { tournament: { id: tournament.id } },
      order,
      relations,
    });
  }

  createLevel(level: Partial<Level>): Promise<Level> {
    return this.levelRepository.save(level);
  }

  updateLevel(levelId: number, updatedLevel: Partial<Level>): Promise<UpdateResult> {
    return this.levelRepository.update(levelId, updatedLevel);
  }
}
