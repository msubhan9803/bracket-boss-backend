import { Club } from "src/clubs/entities/club.entity";
import { Tournament } from "src/tournament-management/entities/tournament.entity";
import { Match } from "../entities/match.entity";
import { MatchRoundStatus } from "../entities/matchRoundStatus.entity";

export class CreateMatchRoundInputDto {
  club: Club;
  tournament: Tournament;
  match: Match;
  startTime: Date;
  endTime: Date;
  matchRoundNumber: number;
  statuses: MatchRoundStatus[];
}
