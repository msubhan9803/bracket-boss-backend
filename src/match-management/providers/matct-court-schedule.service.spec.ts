import { Test, TestingModule } from '@nestjs/testing';
import { MatctCourtScheduleService } from './matct-court-schedule.service';

describe('MatctCourtScheduleService', () => {
  let service: MatctCourtScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatctCourtScheduleService],
    }).compile();

    service = module.get<MatctCourtScheduleService>(MatctCourtScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
