import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BulkMatchImportResponseDto {
  @Field()
  message: string;
}
