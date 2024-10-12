import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTournamentInputDto {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  start_date: Date;

  @Field()
  end_date: Date;

  @Field()
  isPrivate: boolean;

  @Field()
  clubId: number;

  @Field()
  bracketId: number;
}
