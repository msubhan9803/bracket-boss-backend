import { Test, TestingModule } from '@nestjs/testing';
import { FormatManagementService } from './format-management.service';

describe('FormatManagementService', () => {
  let service: FormatManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormatManagementService],
    }).compile();

    service = module.get<FormatManagementService>(FormatManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
