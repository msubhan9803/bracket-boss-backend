import { Tournament } from "src/tournament-management/entities/tournament.entity";
import { Match } from "../entities/match.entity";
import { MatchRoundStatusTypes } from "../types/common";

export class CreateMatchRoundInputDto {
  tournament: Tournament;
  match: Match;
  matchRoundNumber: number;
  status: MatchRoundStatusTypes;
}
