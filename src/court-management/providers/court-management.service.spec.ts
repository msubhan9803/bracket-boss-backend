import { Test, TestingModule } from '@nestjs/testing';
import { CourtManagementService } from './court-management.service';

describe('CourtManagementService', () => {
  let service: CourtManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourtManagementService],
    }).compile();

    service = module.get<CourtManagementService>(CourtManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
