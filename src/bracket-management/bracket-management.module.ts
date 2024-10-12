import { Module } from '@nestjs/common';
import { BracketManagementService } from './providers/bracket-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bracket } from './entities/bracket.entity';
import { BracketManagementResolver } from './bracket-management.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Bracket])],
  providers: [BracketManagementService, BracketManagementResolver],
  exports: [BracketManagementService],
})
export class BracketManagementModule {}
