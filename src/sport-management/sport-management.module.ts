import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportManagementService } from './providers/sport-management.service';
import { Sport } from './entities/sport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  providers: [SportManagementService],
  exports: [SportManagementService],
})
export class SportManagementModule {}
