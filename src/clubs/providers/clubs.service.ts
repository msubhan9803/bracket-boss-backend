import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from '../entities/club.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
  ) {}

  findAll(): Promise<Club[]> {
    return this.clubRepository.find();
  }

  async create(createUserInput: Partial<Club>): Promise<Club> {
    const newUser = this.clubRepository.create({
      ...createUserInput,
    });

    return this.clubRepository.save(newUser);
  }
}
