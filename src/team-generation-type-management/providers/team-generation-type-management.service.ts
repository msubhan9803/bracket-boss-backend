import { Injectable } from '@nestjs/common';
import { TeamGenerationType } from '../entities/team-generation-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamGenerationTypeEnum } from '../types/team-generation-type.enums';

@Injectable()
export class TeamGenerationTypeManagementService {
  constructor(
    @InjectRepository(TeamGenerationType)
    private teamGenerationTypeRepository: Repository<TeamGenerationType>,
  ) {}

  async findOne(id: number): Promise<TeamGenerationType> {
    return this.teamGenerationTypeRepository.findOneBy({ id });
  }

  async findBracketByName(
    name: TeamGenerationTypeEnum,
  ): Promise<TeamGenerationType> {
    return this.teamGenerationTypeRepository.findOneBy({ name });
  }

  async findAll(): Promise<TeamGenerationType[]> {
    return this.teamGenerationTypeRepository.find();
  }
}
