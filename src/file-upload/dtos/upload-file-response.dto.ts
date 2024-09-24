import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadFileResponseDto {
  @Field()
  url: string;
}
