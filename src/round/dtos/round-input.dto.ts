import { RoundStatusTypesEnum } from "src/common/types/global";
import { Pool } from "src/pool/entities/pool.entity";
import { Tournament } from "src/tournament-management/entities/tournament.entity";

export class RoundInputDto {
  name: string;
  tournament: Tournament;
  pool: Pool;
  order: number;
  status: RoundStatusTypesEnum;
}
