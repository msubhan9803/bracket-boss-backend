import { Club } from "src/clubs/entities/club.entity";
import { Tournament } from "src/tournament-management/entities/tournament.entity";
import { MatchStatus } from "../entities/matchStatus.entity";
import { Team } from "src/team-management/entities/team.entity";

export class CreateMatchInputDto {
  club: Club;
  tournament: Tournament;
  homeTeam: Team;
  awayTeam: Team;
  statuses: MatchStatus[];
}
