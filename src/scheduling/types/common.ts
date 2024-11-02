import { User } from 'src/users/entities/user.entity';

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
