import { User } from 'src/users/entities/user.entity';
import { Team } from 'src/team-management/entities/team.entity';

export type DraftTeam = {
  name: string;
  players: User[];
};

export enum SplitSwitchGroupByEnum {
  gender = 'gender',
  rating = 'rating',
}

export enum GenderTypes {
  MALE = 'male',
  FEMALE = 'female',
}

export class DraftMatch {
  matchDate?: Date;
  title: string;
  teams: Team[];
}

export type DraftMatchRound = {
  matches: DraftMatch[];
}

export type DrafRoundsWithMatches = {
  [key: string]: DraftMatchRound;
};

export type DraftMatchToAvailableSchedulesMapping = Map<DraftMatch, {
  courtScheduleId: number;
  date: string;
  startTime: string;
  endTime: string;
}>