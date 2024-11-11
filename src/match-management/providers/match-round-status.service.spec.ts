import { Test, TestingModule } from '@nestjs/testing';
import { MatchRoundStatusService } from './match-round-status.service';

describe('MatchRoundStatusService', () => {
  let service: MatchRoundStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchRoundStatusService],
    }).compile();

    service = module.get<MatchRoundStatusService>(MatchRoundStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
