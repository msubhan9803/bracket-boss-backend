import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
  IsInt,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateTournamentInput {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @IsOptional()
  @IsString({ message: 'Name is required' })
  name?: string;

  @Field()
  @IsOptional()
  @IsString({ message: 'Description is required' })
  description?: string;

  @Field()
  @IsOptional()
  @IsDate({ message: 'Start date is required' })
  start_date?: Date;

  @Field()
  @IsOptional()
  @IsDate({ message: 'End date is required' })
  end_date?: Date;

  @Field()
  @IsOptional()
  @IsBoolean({ message: 'isPrivate must be a boolean value' })
  isPrivate?: boolean;

  @Field()
  @IsOptional()
  @IsInt({ message: 'Club ID must be an integer' })
  clubId?: number;

  @Field()
  @IsOptional()
  @IsInt({ message: 'Bracket ID must be an integer' })
  bracketId?: number;
}
