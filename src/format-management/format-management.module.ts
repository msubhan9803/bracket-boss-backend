import { Module } from '@nestjs/common';
import { FormatManagementService } from './providers/format-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Format } from './entities/format.entity';
import { FormatManagementResolver } from './format-management.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Format])],
  providers: [FormatManagementService, FormatManagementResolver],
  exports: [FormatManagementService],
})
export class FormatManagementModule {}
