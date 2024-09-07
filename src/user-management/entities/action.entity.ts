import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Policy } from './policy.entity';

@ObjectType()
@Entity()
export class Action {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { unique: true })
  name: string;

  @ManyToMany(() => Policy, (policy) => policy.actions)
  policies: Policy[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  constructor(action: Partial<Action>) {
    Object.assign(this, action);
  }
}
