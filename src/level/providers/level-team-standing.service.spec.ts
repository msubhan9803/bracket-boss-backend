import { Test, TestingModule } from '@nestjs/testing';
import { LevelTeamStandingService } from './level-team-standing.service';

describe('LevelTeamStandingService', () => {
  let service: LevelTeamStandingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LevelTeamStandingService],
    }).compile();

    service = module.get<LevelTeamStandingService>(LevelTeamStandingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
