import { Test, TestingModule } from '@nestjs/testing';
import { BracketManagementService } from './bracket-management.service';

describe('BracketManagementService', () => {
  let service: BracketManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BracketManagementService],
    }).compile();

    service = module.get<BracketManagementService>(BracketManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
