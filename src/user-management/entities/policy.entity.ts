import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { RolePolicyModule } from './role-policy-module.entity';
import { Action } from './action.entity';

@ObjectType()
@Entity()
export class Policy {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { unique: true })
  name: string;

  @OneToMany(() => RolePolicyModule, (rpm) => rpm.policy)
  rolePolicyModule: RolePolicyModule[];

  @ManyToMany(() => Action, (action) => action.policies)
  @JoinTable({ name: 'actions_policies' })
  actions: Action[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  constructor(policy: Partial<Policy>) {
    Object.assign(this, policy);
  }
}
