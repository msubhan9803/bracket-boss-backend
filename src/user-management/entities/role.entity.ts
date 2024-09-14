import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { ModulePolicyRole } from './modules-policies-roles.entity';
import { Step } from 'src/users-onboarding-steps/entities/step.entity';

@ObjectType()
@Entity()
export class Role {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @OneToMany(() => ModulePolicyRole, (rpm) => rpm.module)
  rolePolicyModule: ModulePolicyRole[];

  @ManyToMany(() => Step, (step) => step.roles)
  @JoinTable({ name: 'roles_steps' })
  steps: Step[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  constructor(role: Partial<Role>) {
    Object.assign(this, role);
  }
}
