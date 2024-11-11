import { Test, TestingModule } from '@nestjs/testing';
import { MatchRoundService } from './match-round.service';

describe('MatchRoundService', () => {
  let service: MatchRoundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchRoundService],
    }).compile();

    service = module.get<MatchRoundService>(MatchRoundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
