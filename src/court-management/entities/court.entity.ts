import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { Club } from 'src/clubs/entities/club.entity';
import { CourtSchedule } from './court-schedule.entity';

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

  @Field()
  @Column('float', { default: 0 })
  courtLength: number;

  @Field()
  @Column('float', { default: 0 })
  courtWidth: number;

  @ManyToOne(() => Club)
  @JoinColumn()
  @Field(() => Club)
  club: Club;

  @Field(() => [CourtSchedule])
  @OneToMany(() => CourtSchedule, (courtSchedule) => courtSchedule.court)
  courtSchedules: CourtSchedule[];

  constructor(court: Partial<Court>) {
    Object.assign(this, court);
  }
}