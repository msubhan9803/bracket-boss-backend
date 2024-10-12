import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sport } from '../entities/sport.entity';
import { SportName } from '../types/sport.enums';

@Injectable()
export class SportManagementService {
  constructor(
    @InjectRepository(Sport)
    private sportRepository: Repository<Sport>,
  ) {}

  async findSportByName(name: SportName): Promise<Sport> {
    return this.sportRepository.findOneBy({ name });
  }
}
