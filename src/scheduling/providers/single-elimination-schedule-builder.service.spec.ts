import { Test, TestingModule } from '@nestjs/testing';
import { SingleEliminationScheduleBuilderService } from './single-elimination-schedule-builder.service';

describe('SingleEliminationScheduleBuilderService', () => {
  let service: SingleEliminationScheduleBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SingleEliminationScheduleBuilderService],
    }).compile();

    service = module.get<SingleEliminationScheduleBuilderService>(SingleEliminationScheduleBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
