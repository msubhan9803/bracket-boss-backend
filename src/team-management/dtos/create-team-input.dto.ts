import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, IsArray, ArrayNotEmpty } from 'class-validator';

@InputType()
export class CreateTeamInputDto {
  @Field(() => Int)
  @IsInt({ message: 'Tournament ID must be an integer' })
  tournamentId: number;

  @Field(() => Int)
  @IsInt({ message: 'Club ID must be an integer' })
  clubId: number;

  @Field()
  @IsString({ message: 'Name is required' })
  name: string;

  @Field(() => [Int])
  @IsArray()
  @ArrayNotEmpty({ message: 'User IDs array must not be empty' })
  userIds: number[];
}
