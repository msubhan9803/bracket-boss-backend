import { Field, ObjectType } from '@nestjs/graphql';
import { UserRoleClub } from 'src/user-management/entities/user-role-club.entity';

@ObjectType()
export class UpdateUserRoleResponseDto {
  @Field()
  message: string;

  @Field()
  userRoleClub: UserRoleClub;
}
