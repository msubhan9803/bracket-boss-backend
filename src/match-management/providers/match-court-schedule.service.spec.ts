import { Test, TestingModule } from '@nestjs/testing';
import { MatchCourtScheduleService } from './match-court-schedule.service';


describe('MatchCourtScheduleService', () => {
  let service: MatchCourtScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchCourtScheduleService],
    }).compile();

    service = module.get<MatchCourtScheduleService>(MatchCourtScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
