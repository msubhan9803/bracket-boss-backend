import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleSpreadsheetHandlerService } from './schedule-spreadsheet-handler.service';

describe('ScheduleSpreadsheetHandlerService', () => {
  let service: ScheduleSpreadsheetHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleSpreadsheetHandlerService],
    }).compile();

    service = module.get<ScheduleSpreadsheetHandlerService>(ScheduleSpreadsheetHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
