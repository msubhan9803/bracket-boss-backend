import { User } from 'src/users/entities/user.entity';
import { MatchInput } from '../dtos/create-schedule-input.dto';

export type MatchTeam = {
  name: string;
  players: User[];
};

export type Match = {
  name: string;
  teams: MatchTeam[];
};

export enum SplitSwitchGroupByEnum {
  gender = 'gender',
  rating = 'rating',
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