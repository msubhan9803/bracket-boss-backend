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

  @Field(() => [ModulePolicyRole], { nullable: true })
  @OneToMany(() => ModulePolicyRole, (rpm) => rpm.policy)
  rolePolicyModule: ModulePolicyRole[];

  @Field(() => [Action], { nullable: true })
  @ManyToMany(() => Action, (action) => action.policies)
  @JoinTable({ name: 'actions_policies' })
  actions: Action[];

  @Field()
  @CreateDateColumn()
  createdDate: Date;

  @Field()
  @UpdateDateColumn()
  updatedDate: Date;

  constructor(policy: Partial<Policy>) {
    Object.assign(this, policy);
  }
}
