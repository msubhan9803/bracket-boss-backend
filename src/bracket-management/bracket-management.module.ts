import { Module } from '@nestjs/common';
import { BracketManagementService } from './providers/bracket-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bracket } from './entities/bracket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bracket])],
  providers: [BracketManagementService],
  exports: [BracketManagementService],
})
export class BracketManagementModule {}
