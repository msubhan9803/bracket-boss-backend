import { Module } from '@nestjs/common';
import { CourtManagementService } from './providers/court-management.service';
import { CourtManagementResolver } from './court-management.resolver';
import { ClubsModule } from 'src/clubs/clubs.module';
import { Court } from './entities/court.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Court]), ClubsModule],
  providers: [CourtManagementService, CourtManagementResolver],
})
export class CourtManagementModule {}
