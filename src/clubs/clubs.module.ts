import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from './entities/club.entity';
import { ClubsResolver } from './clubs.resolver';
import { ClubsService } from './providers/clubs.service';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { UsersOnboardingStepsModule } from 'src/users-onboarding-steps/users-onboarding-steps.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club]),
    forwardRef(() => UsersModule),
    forwardRef(() => UsersOnboardingStepsModule),
  ],
  providers: [ClubsResolver, ClubsService, JwtService],
  exports: [ClubsService],
})
export class ClubsModule {}
