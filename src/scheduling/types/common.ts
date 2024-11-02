export type Team = {
  name: string;
  players: number[];
};

export type Match = {
  name: string;
  teams: Team[];
};

export enum GroupByEnum {
  GENDER = 'gender',
  RATING = 'rating',
}

export enum GenderTypes {
  MALE = 'male',
  FEMALE = 'female',
}
