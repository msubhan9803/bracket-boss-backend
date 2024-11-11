import { Test, TestingModule } from '@nestjs/testing';
import { TournamentRoundService } from './tournament-round.service';

describe('TournamentRoundService', () => {
  let service: TournamentRoundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentRoundService],
    }).compile();

    service = module.get<TournamentRoundService>(TournamentRoundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
