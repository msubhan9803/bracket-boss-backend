import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class UpdateUserClubDto {
  @Field()
  @IsNumber({}, { message: 'Club ID is required' })
  clubId: number;
}
