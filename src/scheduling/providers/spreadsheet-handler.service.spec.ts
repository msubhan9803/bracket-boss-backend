import { Test, TestingModule } from '@nestjs/testing';
import { SpreadsheetHandlerService } from './schedule-spreadsheet-handler.service';

describe('SpreadsheetHandlerService', () => {
  let service: SpreadsheetHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpreadsheetHandlerService],
    }).compile();

    service = module.get<SpreadsheetHandlerService>(SpreadsheetHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
