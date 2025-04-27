import { Format } from "src/format-management/entities/format.entity";
import { LevelTypeEnum } from "../types/common";
import { Tournament } from "src/tournament-management/entities/tournament.entity";

export class LevelInputDto {
  type: LevelTypeEnum;
  name: string;
  order: number;
  format: Format;
  tournament: Tournament;
}
