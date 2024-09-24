import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Policy } from './policy.entity';
import { Module } from './module.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';

@ObjectType()
@Entity({ name: 'modules_policies_roles' })
export class ModulePolicyRole {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Role)
  @ManyToOne(() => Role, (role) => role.rolePolicyModule, {
    onDelete: 'CASCADE',
  })
  role: Role;

  @Field(() => Module)
  @ManyToOne(() => Module, (module) => module.rolePolicyModule, {
    onDelete: 'CASCADE',
  })
  module: Module;

  @Field(() => Policy)
  @ManyToOne(() => Policy, (policy) => policy.rolePolicyModule, {
    onDelete: 'CASCADE',
  })
  policy: Policy;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(rolePolicyModule: Partial<ModulePolicyRole>) {
    Object.assign(this, rolePolicyModule);
  }
}
