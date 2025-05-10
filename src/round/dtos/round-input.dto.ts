import { Pool } from "src/pool/entities/pool.entity";
import { Tournament } from "src/tournament-management/entities/tournament.entity";
import { RoundStatusTypesEnum } from "../types/common";

export class RoundInputDto {
  name: string;
  tournament: Tournament;
  pool: Pool;
  order: number;
  status: RoundStatusTypesEnum;
}
