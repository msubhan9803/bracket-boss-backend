import { Club } from "src/clubs/entities/club.entity";
import { CourtSchedule } from "src/court-management/entities/court-schedule.entity";
import { Court } from "src/court-management/entities/court.entity";
import { Tournament } from "src/tournament-management/entities/tournament.entity";
import { TournamentRound } from "src/tournament-management/entities/tournamentRound.entity";
import { MatchStatus } from "../entities/matchStatus.entity";
import { Team } from "src/team-management/entities/team.entity";

export class CreateMatchInputDto {
  club: Club;
  tournament: Tournament;
  courts: Court[];
  courtSchedules: CourtSchedule[];
  matchDate: Date;
  tournamentRound: TournamentRound;
  homeTeam: Team;
  awayTeam: Team;
  statuses: MatchStatus[];
}
