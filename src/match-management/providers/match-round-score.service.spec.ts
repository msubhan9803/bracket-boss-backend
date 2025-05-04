import { Test, TestingModule } from '@nestjs/testing';
import { MatchRoundScoreService } from './match-round-score.service';

describe('MatchRoundScoreService', () => {
  let service: MatchRoundScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchRoundScoreService],
    }).compile();

    service = module.get<MatchRoundScoreService>(MatchRoundScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
