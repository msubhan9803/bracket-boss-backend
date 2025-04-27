import { Level } from "src/level/entities/level.entity";
import { Tournament } from "src/tournament-management/entities/tournament.entity";

export class PoolInputDto {
  name: string;
  tournament: Tournament;
  level: Level;
  order: number;
}
