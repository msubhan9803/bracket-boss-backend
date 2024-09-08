import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RegisterResponseDto {
  @Field()
  message: string;
}
