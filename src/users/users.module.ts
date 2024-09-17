import { forwardRef, Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { UsersOnboardingStepsModule } from 'src/users-onboarding-steps/users-onboarding-steps.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserManagementModule,
    forwardRef(() => UsersOnboardingStepsModule),
  ],
  providers: [UsersResolver, UsersService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
