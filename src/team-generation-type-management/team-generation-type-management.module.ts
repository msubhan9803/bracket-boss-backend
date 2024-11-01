import { Module } from '@nestjs/common';
import { TeamGenerationTypeManagementService } from './providers/team-generation-type-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamGenerationType } from './entities/team-generation-type.entity';
import { TeamGenerationTypeManagementResolver } from './team-generation-type-management.resolver';
import { FormatManagementModule } from 'src/format-management/format-management.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamGenerationType]),
    FormatManagementModule,
  ],
  providers: [
    TeamGenerationTypeManagementService,
    TeamGenerationTypeManagementResolver,
  ],
  exports: [TeamGenerationTypeManagementService],
})
export class TeamGenerationTypeManagementModule {}
