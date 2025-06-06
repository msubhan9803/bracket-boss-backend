import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import {
  Field,
  ObjectType,
  HideField,
  registerEnumType,
} from '@nestjs/graphql';
import { Club } from 'src/clubs/entities/club.entity';
import { Step } from 'src/users-onboarding-steps/entities/step.entity';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { UserRoleClub } from 'src/user-management/entities/user-role-club.entity';
import { GenderTypes } from 'src/scheduling/types/common';
import { Team } from 'src/team-management/entities/team.entity';

registerEnumType(GenderTypes, {
  name: 'GenderTypes',
});

@ObjectType()
@Entity()
export class User {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar')
  name: string;

  @Field()
  @Column('varchar', { unique: true })
  email: string;

  @HideField()
  @Column('varchar', { nullable: true })
  password: string;

  @Field({ nullable: true })
  @Column('varchar', { nullable: true })
  profileImage?: string;

  @Field({ defaultValue: false })
  @Column('boolean', { default: false })
  isEmailVerified: boolean;

  @Field(() => [Club], { nullable: true })
  @ManyToMany(() => Club, (club) => club.users)
  @JoinTable({ name: 'clubs_users' })
  clubs: Club[];

  @Field()
  @Column('varchar')
  otpSecret: string;

  @Field(() => [Step], { nullable: true })
  @ManyToMany(() => Step, (step) => step.users)
  @JoinTable({ name: 'steps_users' })
  steps: Step[];

  @Field(() => [UserRoleClub], { nullable: true })
  @OneToMany(() => UserRoleClub, (userRoleClub) => userRoleClub.user)
  userRoleClub: UserRoleClub[];

  @Field(() => GenderTypes)
  @Column('varchar', { nullable: true })
  gender: GenderTypes;

  @Field(() => [Team], { nullable: true })
  @ManyToMany(() => Team, (team) => team.users)
  teams: Team[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
