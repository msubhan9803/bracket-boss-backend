import { Tournament } from "src/tournament-management/entities/tournament.entity";
import { Team } from "src/team-management/entities/team.entity";
import { MatchStatusTypes } from "../types/common";
import { Round } from "src/round/entities/round.entity";

export class CreateMatchInputDto {
  tournament: Tournament;
  title: string;
  homeTeam: Team;
  awayTeam: Team;
  status: MatchStatusTypes;
  round: Round;
}
