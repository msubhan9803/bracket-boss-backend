import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TournamentWinner } from '../entities/tournamentWinner.entity';

@Injectable()
export class TournamentWinnerService {
  constructor(
    @InjectRepository(TournamentWinner)
    private tournamentWinnerRepository: Repository<TournamentWinner>,
  ) {}

  createTournamentWinner(tournamentResult: TournamentWinner): Promise<TournamentWinner> {
    return this.tournamentWinnerRepository.save(tournamentResult);
  }
}
