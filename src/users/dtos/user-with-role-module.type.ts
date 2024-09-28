import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { UserRoleClub } from 'src/user-management/entities/user-role-club.entity';

@ObjectType()
export class UserWithRoleClub {
  @Field(() => User)
  user: User;

  @Field(() => UserRoleClub, { nullable: true })
  userRoleClub: UserRoleClub;
}
