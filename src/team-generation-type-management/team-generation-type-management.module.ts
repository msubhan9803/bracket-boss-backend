import { Module } from '@nestjs/common';
import { TeamGenerationTypeManagementService } from './providers/team-generation-type-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamGenerationType } from './entities/team-generation-type.entity';
import { TeamGenerationTypeManagementResolver } from './team-generation-type-management.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TeamGenerationType])],
  providers: [
    TeamGenerationTypeManagementService,
    TeamGenerationTypeManagementResolver,
  ],
  exports: [TeamGenerationTypeManagementService],
})
export class TeamGenerationTypeManagementModule {}
