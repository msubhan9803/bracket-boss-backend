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

@Entity({ name: 'modules_policies_roles' })
export class RolePolicyModule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.rolePolicyModule, {
    onDelete: 'CASCADE',
  })
  role: Role;

  @ManyToOne(() => Module, (module) => module.rolePolicyModule, {
    onDelete: 'CASCADE',
  })
  module: Module;

  @ManyToOne(() => Policy, (policy) => policy.rolePolicyModule, {
    onDelete: 'CASCADE',
  })
  policy: Policy;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(rolePolicyModule: Partial<RolePolicyModule>) {
    Object.assign(this, rolePolicyModule);
  }
}
