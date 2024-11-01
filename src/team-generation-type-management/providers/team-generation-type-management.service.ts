import { Injectable } from '@nestjs/common';
import { TeamGenerationType } from '../entities/team-generation-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamGenerationTypeEnum } from '../types/team-generation-type.enums';
import { Format } from 'src/format-management/entities/format.entity';

@Injectable()
export class TeamGenerationTypeManagementService {
  constructor(
    @InjectRepository(TeamGenerationType)
    private teamGenerationTypeRepository: Repository<TeamGenerationType>,
  ) {}

  async findOne(id: number): Promise<TeamGenerationType> {
    return this.teamGenerationTypeRepository.findOneBy({ id });
  }

  async findTeamGenerationTypeByName(
    name: TeamGenerationTypeEnum,
  ): Promise<TeamGenerationType> {
    return this.teamGenerationTypeRepository.findOneBy({ name });
  }

  async findAllByFormatId(format: Format): Promise<TeamGenerationType[]> {
    return this.teamGenerationTypeRepository.find({
      where: { formats: { id: format.id } },
      relations: ['formats'],
    });
  }
}
