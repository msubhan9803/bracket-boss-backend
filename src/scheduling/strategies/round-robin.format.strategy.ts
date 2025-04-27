import { Injectable } from '@nestjs/common';
import { FormatStrategy } from '../interface/format-strategy.interface';
import { FormatType } from 'src/format-management/types/format.enums';
import { Team } from 'src/team-management/entities/team.entity';
import { Round } from 'src/round/entities/round.entity';
import { RoundRobinScheduleBuilderService } from '../providers/round-robin-schedule-builder.service';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Pool } from 'src/pool/entities/pool.entity';

@Injectable()
export class RoundRobinStrategy implements FormatStrategy {
  type = FormatType.round_robin;

  constructor(private readonly roundRobinScheduleBuilderService: RoundRobinScheduleBuilderService) {}

  async createInitialRounds(tournament: Tournament, pool: Pool, teams: Team[]): Promise<Round[]> {
    return this.roundRobinScheduleBuilderService.generateRoundsMatches(tournament, pool, teams);
  }
}
