import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/user-management/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Club } from 'src/clubs/entities/club.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';

@ObjectType()
@Entity({ name: 'users_roles_clubs' })
export class UserRoleClub {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Role, { nullable: true })
  @ManyToOne(() => Role, (role) => role.userRoleClub, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  role: Role;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.userRoleClub, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  user: User;

  @Field(() => Club, { nullable: true })
  @ManyToOne(() => Club, (club) => club.userRoleClub, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  club: Club;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(userRoleClub: Partial<UserRoleClub>) {
    Object.assign(this, userRoleClub);
  }
}
