import { Test, TestingModule } from '@nestjs/testing';
import { SportManagementService } from './sport-management.service';

describe('SportManagementService', () => {
  let service: SportManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportManagementService],
    }).compile();

    service = module.get<SportManagementService>(SportManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
