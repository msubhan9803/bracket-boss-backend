import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class StepsOfUserDto {
  @Field()
  @IsNumber()
  userId: number;
}
