import { Test, TestingModule } from '@nestjs/testing';
import { TournamentResultService } from './tournament-result.service';

describe('TournamentResultService', () => {
  let service: TournamentResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentResultService],
    }).compile();

    service = module.get<TournamentResultService>(TournamentResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
