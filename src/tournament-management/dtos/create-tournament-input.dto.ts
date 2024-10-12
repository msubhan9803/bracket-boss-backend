import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsBoolean, IsDate, IsInt } from 'class-validator';

@InputType()
export class CreateTournamentInputDto {
  @Field()
  @IsString({ message: 'Name is required' })
  name: string;

  @Field()
  @IsString({ message: 'Description is required' })
  description: string;

  @Field()
  @IsDate({ message: 'Start date is required' })
  start_date: Date;

  @Field()
  @IsDate({ message: 'End date is required' })
  end_date: Date;

  @Field()
  @IsBoolean({ message: 'isPrivate must be a boolean value' })
  isPrivate: boolean;

  @Field()
  @IsInt({ message: 'Club ID must be an integer' })
  clubId: number;

  @Field()
  @IsInt({ message: 'Bracket ID must be an integer' })
  bracketId: number;
}
