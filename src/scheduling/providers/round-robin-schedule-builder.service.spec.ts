import { Test, TestingModule } from '@nestjs/testing';
import { RoundRobinScheduleBuilderService } from './round-robin-schedule-builder.service';

describe('RoundRobinScheduleBuilderService', () => {
  let service: RoundRobinScheduleBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoundRobinScheduleBuilderService],
    }).compile();

    service = module.get<RoundRobinScheduleBuilderService>(RoundRobinScheduleBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
