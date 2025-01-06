import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { DayName } from '../types/global';

registerEnumType(DayName, {
  name: 'DayName',
});

@ObjectType()
@Entity()
export class Day {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => DayName)
  @Column({
    type: 'enum',
    enum: DayName,
  })
  name: DayName;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(day: Partial<Day>) {
    Object.assign(this, day);
  }
}