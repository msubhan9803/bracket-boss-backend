import { Module } from '@nestjs/common';
import { TournamentManagementService } from './providers/tournament-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { TournamentManagementResolver } from './tournament-management.resolver';
import { SportManagementModule } from 'src/sport-management/sport-management.module';
import { FormatManagementModule } from 'src/format-management/format-management.module';
import { ClubsModule } from 'src/clubs/clubs.module';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { TeamGenerationTypeManagementModule } from 'src/team-generation-type-management/team-generation-type-management.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament]),
    SportManagementModule,
    FormatManagementModule,
    ClubsModule,
    UsersModule,
    TeamGenerationTypeManagementModule,
  ],
  providers: [
    TournamentManagementService,
    TournamentManagementResolver,
    JwtService,
  ],
  exports: [TournamentManagementService],
})
export class TournamentManagementModule {}
