import { forwardRef, Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { UsersOnboardingStepsModule } from 'src/users-onboarding-steps/users-onboarding-steps.module';
import { ClubsModule } from 'src/clubs/clubs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserManagementModule,
    forwardRef(() => UsersOnboardingStepsModule),
    forwardRef(() => ClubsModule),
  ],
  providers: [UsersResolver, UsersService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
