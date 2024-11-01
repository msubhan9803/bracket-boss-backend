import { Injectable } from '@nestjs/common';
import { Format } from '../entities/format.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormatType } from '../types/format.enums';

@Injectable()
export class FormatManagementService {
  constructor(
    @InjectRepository(Format)
    private formatRepository: Repository<Format>,
  ) {}

  async findOne(id: number): Promise<Format> {
    return this.formatRepository.findOneBy({ id });
  }

  async findBracketByName(name: FormatType): Promise<Format> {
    return this.formatRepository.findOneBy({ name });
  }

  async findAll(): Promise<Format[]> {
    return this.formatRepository.find();
  }
}
