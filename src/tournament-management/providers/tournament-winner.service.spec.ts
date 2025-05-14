import { Test, TestingModule } from '@nestjs/testing';
import { TournamentWinnerService } from './tournament-winner.service';

describe('TournamentWinnerService', () => {
  let service: TournamentWinnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentWinnerService],
    }).compile();

    service = module.get<TournamentWinnerService>(TournamentWinnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
