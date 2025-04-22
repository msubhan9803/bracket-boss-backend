import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './entities/round.entity';
import { RoundTeam } from './entities/round-team.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Round,
            RoundTeam
        ])
    ]
})
export class RoundModule {}
