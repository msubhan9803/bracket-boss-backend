import { FormatType } from 'src/format-management/types/format.enums';
import { Team } from 'src/team-management/entities/team.entity';
import { Round } from 'src/round/entities/round.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Pool } from 'src/pool/entities/pool.entity';

export interface FormatStrategy {
  type: FormatType;
  createInitialRounds(tournament: Tournament, pool: Pool, teams: Team[]): Promise<Round[]>;
}
