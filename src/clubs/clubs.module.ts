import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from './entities/club.entity';
import { ClubsResolver } from './clubs.resolver';
import { ClubsService } from './providers/clubs.service';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Club]), UsersModule],
  providers: [ClubsResolver, ClubsService, JwtService],
})
export class ClubsModule {}
