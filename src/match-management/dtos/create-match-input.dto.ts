import { Tournament } from "src/tournament-management/entities/tournament.entity";
import { Team } from "src/team-management/entities/team.entity";
import { MatchStatusTypes } from "../types/common";
import { Round } from "src/round/entities/round.entity";
import { Level } from "src/level/entities/level.entity";
import { Pool } from "src/pool/entities/pool.entity";

export class CreateMatchInputDto {
  tournament: Tournament;
  title: string;
  homeTeam: Team;
  awayTeam: Team;
  status: MatchStatusTypes;
  level: Level;
  pool: Pool;
  round: Round;
}
