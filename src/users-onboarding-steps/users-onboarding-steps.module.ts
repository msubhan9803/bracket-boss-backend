import { Module } from '@nestjs/common';
import { UsersOnboardingStepsService } from './providers/users-onboarding-steps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Step } from './entities/step.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Step])],
  providers: [UsersOnboardingStepsService],
  exports: [UsersOnboardingStepsService],
})
export class UsersOnboardingStepsModule {}
