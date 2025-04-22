import { Module } from '@nestjs/common';
import { TeamManagementResolver } from './team-management.resolver';
import { TeamManagementService } from './providers/team-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { ClubsModule } from 'src/clubs/clubs.module';
import { UsersModule } from 'src/users/users.module';
import { TournamentManagementModule } from 'src/tournament-management/tournament-management.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    ClubsModule,
    UsersModule,
    TournamentManagementModule,
  ],
  providers: [TeamManagementResolver, TeamManagementService, JwtService],
  exports: [TeamManagementService]
})
export class TeamManagementModule {}
