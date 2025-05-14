import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TournamentResult } from '../entities/tournamentResult.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TournamentResultService {
  constructor(
    @InjectRepository(TournamentResult)
    private tournamentResultRepository: Repository<TournamentResult>,
  ) {}

  getTournamentResultsByTournamentId(tournamentResultId: number, relations: string[] = ['winners', 'winners.team', 'winners.team.users']): Promise<TournamentResult[]> {
    return this.tournamentResultRepository.find({
      where: { id: tournamentResultId },
      relations,
    });
  }

  createTournamentResult(tournamentResult: Partial<TournamentResult>): Promise<TournamentResult> {
    return this.tournamentResultRepository.save(tournamentResult);
  }
}
