import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchRound } from '../entities/matchRound.entity';
import { CreateMatchRoundInputDto } from '../dtos/create-match-round-input.dto';

@Injectable()
export class MatchRoundService {
    constructor(
        @InjectRepository(MatchRound)
        private readonly matchRoundRepository: Repository<MatchRound>,
    ) {}
    
    createMatchRound(matchRound: CreateMatchRoundInputDto): Promise<MatchRound> {
        return this.matchRoundRepository.save(matchRound);
    }
}
