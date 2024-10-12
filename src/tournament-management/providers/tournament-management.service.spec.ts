import { Test, TestingModule } from '@nestjs/testing';
import { TournamentManagementService } from './tournament-management.service';

describe('TournamentManagementService', () => {
  let service: TournamentManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentManagementService],
    }).compile();

    service = module.get<TournamentManagementService>(TournamentManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
