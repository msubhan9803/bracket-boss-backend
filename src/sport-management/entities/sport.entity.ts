import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { SportName } from '../types/sport.enums';

registerEnumType(SportName, {
  name: 'SportName',
});

@ObjectType()
@Entity()
export class Sport {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => SportName)
  @Column('varchar', { unique: true })
  name: SportName;

  @Field()
  @Column('text')
  description: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(sport: Partial<Sport>) {
    Object.assign(this, sport);
  }
}
