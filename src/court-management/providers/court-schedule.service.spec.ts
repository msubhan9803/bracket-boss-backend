import { Test, TestingModule } from '@nestjs/testing';
import { CourtScheduleService } from './court-schedule.service';

describe('CourtScheduleService', () => {
  let service: CourtScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourtScheduleService],
    }).compile();

    service = module.get<CourtScheduleService>(CourtScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
