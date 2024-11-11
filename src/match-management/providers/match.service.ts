import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '../entities/match.entity';
import { Repository } from 'typeorm';
import { CreateMatchInputDto } from '../dtos/create-match-input.dto';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
    ) {}

    createMatch(match: CreateMatchInputDto): Promise<Match> {
        return this.matchRepository.save(match);
    }
}
