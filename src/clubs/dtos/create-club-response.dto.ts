import { Field, ObjectType } from '@nestjs/graphql';
import { Club } from '../entities/club.entity';

@ObjectType()
export class CreateClubResponseDto {
  @Field()
  message: string;

  @Field()
  club: Club;
}
