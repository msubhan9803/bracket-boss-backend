import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Club } from 'src/clubs/entities/club.entity';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Sport } from 'src/sport-management/entities/sport.entity';
import { Bracket } from 'src/bracket-management/entities/bracket.entity';
import { TeamsTournamentsUsers } from 'src/team-management/entities/teams-tournaments-users.entity';

@ObjectType()
@Entity()
export class Tournament {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Club)
  @JoinColumn()
  @Field(() => Club)
  club: Club;

  @ManyToOne(() => Sport)
  @JoinColumn()
  @Field(() => Sport)
  sport: Sport;

  @ManyToOne(() => Bracket)
  @JoinColumn()
  @Field(() => Bracket)
  bracket: Bracket;

  @Field()
  @Column('varchar')
  name: string;

  @Field()
  @Column('text')
  description: string;

  @Field()
  @CreateDateColumn()
  start_date: Date;

  @Field()
  @CreateDateColumn()
  end_date: Date;

  @Field()
  @Column('boolean')
  isPrivate: boolean;

  @Field(() => [TeamsTournamentsUsers], { nullable: true })
  @OneToMany(() => TeamsTournamentsUsers, (ttu) => ttu.tournament)
  teamsTournamentsUsers: TeamsTournamentsUsers[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(tournament: Partial<Tournament>) {
    Object.assign(this, tournament);
  }
}
