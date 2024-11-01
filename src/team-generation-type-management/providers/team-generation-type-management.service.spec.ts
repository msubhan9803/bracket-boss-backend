import { Test, TestingModule } from '@nestjs/testing';
import { TeamGenerationTypeManagementService } from './team-generation-type-management.service';

describe('TeamGenerationTypeManagementService', () => {
  let service: TeamGenerationTypeManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamGenerationTypeManagementService],
    }).compile();

    service = module.get<TeamGenerationTypeManagementService>(
      TeamGenerationTypeManagementService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
