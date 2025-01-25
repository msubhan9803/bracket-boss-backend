import { User } from 'src/users/entities/user.entity';
import { MatchInput } from '../dtos/create-schedule-input.dto';

export type Team = {
  name: string;
  players: User[];
};

export type Match = {
  name: string;
  teams: Team[];
};

export enum GroupByEnum {
  GENDER = 'GENDER',
  RATING = 'RATING',
}

export enum GenderTypes {
  MALE = 'male',
  FEMALE = 'female',
}

export type SingleMatchGroup = {
  matches: MatchInput[];
}

export type GroupedMatches = {
  [key: string]: SingleMatchGroup;
};