import { Test, TestingModule } from '@nestjs/testing';
import { TournamentRoundStatusService } from './tournament-round-status.service';

describe('TournamentRoundStatusService', () => {
  let service: TournamentRoundStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentRoundStatusService],
    }).compile();

    service = module.get<TournamentRoundStatusService>(TournamentRoundStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
