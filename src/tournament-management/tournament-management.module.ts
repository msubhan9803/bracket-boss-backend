import { Module } from '@nestjs/common';
import { TournamentManagementService } from './providers/tournament-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { TournamentManagementResolver } from './tournament-management.resolver';
import { SportManagementModule } from 'src/sport-management/sport-management.module';
import { BracketManagementModule } from 'src/bracket-management/bracket-management.module';
import { ClubsModule } from 'src/clubs/clubs.module';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tournament]),
    SportManagementModule,
    BracketManagementModule,
    ClubsModule,
    UsersModule,
  ],
  providers: [
    TournamentManagementService,
    TournamentManagementResolver,
    JwtService,
  ],
  exports: [TournamentManagementService],
})
export class TournamentManagementModule {}
