import { Test, TestingModule } from '@nestjs/testing';
import { CreateScheduleHelperService } from './create-schedule-helper.service';

describe('CreateScheduleHelperService', () => {
  let service: CreateScheduleHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateScheduleHelperService],
    }).compile();

    service = module.get<CreateScheduleHelperService>(CreateScheduleHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
