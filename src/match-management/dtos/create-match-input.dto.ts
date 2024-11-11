import { Club } from "src/clubs/entities/club.entity";
import { Court } from "src/court-management/entities/court.entity";
import { Team } from "src/scheduling/types/common";
import { Tournament } from "src/tournament-management/entities/tournament.entity";
import { TournamentRound } from "src/tournament-management/entities/tournamentRound.entity";

export class CreateMatchInputDto {
  club: Club;
  tournament: Tournament;
  courts: Court[];
  matchDate: Date;
  tournamentRound: TournamentRound;
  homeTeam: Team;
  awayTeam: Team;
}
