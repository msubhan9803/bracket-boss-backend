import { Test, TestingModule } from '@nestjs/testing';
import { UsersOnboardingStepsService } from './users-onboarding-steps.service';

describe('UsersOnboardingStepsService', () => {
  let service: UsersOnboardingStepsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersOnboardingStepsService],
    }).compile();

    service = module.get<UsersOnboardingStepsService>(
      UsersOnboardingStepsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
