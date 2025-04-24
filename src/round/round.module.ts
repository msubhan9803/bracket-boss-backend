import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './entities/round.entity';
import { RoundTeam } from './entities/round-team.entity';
import { RoundService } from './providers/round.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Round,
            RoundTeam
        ])
    ],
    providers: [RoundService],
    exports: [RoundService]
})
export class RoundModule {}
