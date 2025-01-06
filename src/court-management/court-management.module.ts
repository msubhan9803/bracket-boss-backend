import { Module } from '@nestjs/common';
import { CourtManagementService } from './providers/court-management.service';
import { CourtManagementResolver } from './court-management.resolver';
import { ClubsModule } from 'src/clubs/clubs.module';
import { Court } from './entities/court.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { CourtSchedule } from './entities/court-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Court, CourtSchedule]), ClubsModule, UsersModule],
  providers: [CourtManagementService, CourtManagementResolver, JwtService],
  exports: [CourtManagementService]
})
export class CourtManagementModule {}
