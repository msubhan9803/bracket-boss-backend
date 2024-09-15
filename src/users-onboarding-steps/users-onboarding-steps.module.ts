import { Module } from '@nestjs/common';
import { UsersOnboardingStepsService } from './providers/users-onboarding-steps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Step } from './entities/step.entity';
import { UsersOnboardingStepsResolver } from './users-onboarding-steps.resolver';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/user-management/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Step, User, Role])],
  providers: [
    UsersOnboardingStepsService,
    UsersOnboardingStepsResolver,
    JwtService,
  ],
  exports: [UsersOnboardingStepsService],
})
export class UsersOnboardingStepsModule {}
