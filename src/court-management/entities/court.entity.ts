import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Club } from 'src/clubs/entities/club.entity';
import { Match } from 'src/match-management/entities/match.entity';

@ObjectType()
@Entity()
export class Court {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { unique: true })
  name: string;

  @Field()
  @Column('text')
  location: string;

  @ManyToOne(() => Club)
  @JoinColumn()
  @Field(() => Club)
  club: Club;

  @Field(() => [Match])
  @ManyToMany(() => Match, (match) => match.courts)
  @JoinColumn()
  matches: Match[];

  constructor(court: Partial<Court>) {
    Object.assign(this, court);
  }
}
