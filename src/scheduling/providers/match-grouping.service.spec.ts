import { Test, TestingModule } from '@nestjs/testing';
import { MatchGroupingService } from './match-grouping.service';

describe('MatchGroupingService', () => {
  let service: MatchGroupingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchGroupingService],
    }).compile();

    service = module.get<MatchGroupingService>(MatchGroupingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
