import { FormatType } from 'src/format-management/types/format.enums';
import { Team } from 'src/team-management/entities/team.entity';
import { Round } from 'src/round/entities/round.entity';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Pool } from 'src/pool/entities/pool.entity';
import { Level } from 'src/level/entities/level.entity';
import { LevelTeamStanding } from 'src/level/entities/level-team-standing.entity';

export interface FormatStrategy {
  type: FormatType;
  createInitialRounds(tournament: Tournament, level: Level, pool: Pool, teams: Team[]): Promise<Round[]>;
  handleEndRound(poolId: number): void;
  selectTeams?(levelTeamStanding: LevelTeamStanding[]): Promise<Team[]>;
  concludeTournament(tournament: Tournament): Promise<void>;
}
