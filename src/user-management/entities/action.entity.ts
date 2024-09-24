import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Policy } from './policy.entity';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';

@ObjectType()
@Entity()
export class Action {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { unique: true })
  name: string;

  @Field(() => [Policy], { nullable: true })
  @ManyToMany(() => Policy, (policy) => policy.actions)
  policies: Policy[];

  @Field()
  @CreateDateColumn()
  createdDate: Date;

  @Field()
  @UpdateDateColumn()
  updatedDate: Date;

  constructor(action: Partial<Action>) {
    Object.assign(this, action);
  }
}
