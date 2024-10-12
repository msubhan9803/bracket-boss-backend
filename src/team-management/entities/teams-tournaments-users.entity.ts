import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Tournament } from 'src/tournament-management/entities/tournament.entity';
import { Club } from 'src/clubs/entities/club.entity';
import { User } from 'src/users/entities/user.entity';
import { Team } from './team.entity';

@ObjectType()
@Entity({ name: 'teams_tournaments_users' })
export class TeamsTournamentsUsers {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Tournament)
  @ManyToOne(() => Tournament, (role) => role.teamsTournamentsUsers, {
    onDelete: 'CASCADE',
  })
  tournament: Tournament;

  @Field(() => Club)
  @ManyToOne(() => Club, (module) => module.teamsTournamentsUsers, {
    onDelete: 'CASCADE',
  })
  club: Club;

  @Field(() => User)
  @ManyToOne(() => User, (policy) => policy.teamsTournamentsUsers, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Field(() => Team)
  @ManyToOne(() => Team, (policy) => policy.teamsTournamentsUsers, {
    onDelete: 'CASCADE',
  })
  team: Team;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(teamsTournamentsUsers: Partial<TeamsTournamentsUsers>) {
    Object.assign(this, teamsTournamentsUsers);
  }
}
