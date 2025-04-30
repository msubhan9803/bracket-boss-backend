import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './entities/round.entity';
import { RoundTeam } from './entities/round-team.entity';
import { RoundService } from './providers/round.service';
import { RoundResolver } from './round.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Round,
            RoundTeam
        ]),
        UsersModule
    ],
    providers: [RoundService, RoundResolver, JwtService],
    exports: [RoundService]
})
export class RoundModule {}
