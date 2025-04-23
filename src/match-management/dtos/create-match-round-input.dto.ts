import { Tournament } from "src/tournament-management/entities/tournament.entity";
import { Match } from "../entities/match.entity";

export class CreateMatchRoundInputDto {
  tournament: Tournament;
  match: Match;
  startTime: Date;
  endTime: Date;
  matchRoundNumber: number;
}
