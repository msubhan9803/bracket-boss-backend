import { Format } from "src/format-management/entities/format.entity";
import { LevelTypeEnum } from "../types/common";

export class LevelInputDto {
  type: LevelTypeEnum;
  name: string;
  order: number;
  format: Format;
}
