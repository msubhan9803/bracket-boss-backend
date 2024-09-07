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
import { ModulePolicyRole } from './modules-policies-roles.entity';
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

  @OneToMany(() => ModulePolicyRole, (rpm) => rpm.policy)
  rolePolicyModule: ModulePolicyRole[];

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
