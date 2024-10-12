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
import { Field, ObjectType, HideField } from '@nestjs/graphql';
import { Club } from 'src/clubs/entities/club.entity';
import { Step } from 'src/users-onboarding-steps/entities/step.entity';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { UserRoleClub } from 'src/user-management/entities/user-role-club.entity';
import { TeamsTournamentsUsers } from 'src/team-management/entities/teams-tournaments-users.entity';

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

  @Field(() => [TeamsTournamentsUsers], { nullable: true })
  @OneToMany(() => TeamsTournamentsUsers, (ttu) => ttu.user)
  teamsTournamentsUsers: TeamsTournamentsUsers[];

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
