import { Test, TestingModule } from '@nestjs/testing';
import { MatchStatusService } from './match-status.service';

describe('MatchStatusService', () => {
  let service: MatchStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchStatusService],
    }).compile();

    service = module.get<MatchStatusService>(MatchStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
