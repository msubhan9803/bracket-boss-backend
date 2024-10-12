import { Injectable } from '@nestjs/common';
import { Bracket } from '../entities/bracket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BracketType } from '../types/bracket.enums';

@Injectable()
export class BracketManagementService {
  constructor(
    @InjectRepository(Bracket)
    private sportRepository: Repository<Bracket>,
  ) {}

  async findOne(id: number): Promise<Bracket> {
    return this.sportRepository.findOneBy({ id });
  }

  async findBracketByName(name: BracketType): Promise<Bracket> {
    return this.sportRepository.findOneBy({ name });
  }
}
