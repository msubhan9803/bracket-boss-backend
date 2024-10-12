import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { BracketType } from '../types/bracket.enums';

registerEnumType(BracketType, {
  name: 'BracketType',
});

@ObjectType()
@Entity()
export class Bracket {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => BracketType)
  @Column('varchar', { unique: true })
  name: BracketType;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(bracket: Partial<Bracket>) {
    Object.assign(this, bracket);
  }
}
