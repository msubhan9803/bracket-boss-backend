import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteScheduleResponseDto {
  @Field()
  message: string;
}
