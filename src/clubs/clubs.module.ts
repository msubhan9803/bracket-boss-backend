import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from './enities/club.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Club])],
  providers: [],
})
export class ClubsModule {}
