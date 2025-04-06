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
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ModulePolicyRole } from './modules-policies-roles.entity';
import { Step } from 'src/users-onboarding-steps/entities/step.entity';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { UserRoleClub } from './user-role-club.entity';
import { RoleName } from '../types/enums';

registerEnumType(RoleName, {
  name: 'RoleName',
});

@ObjectType()
@Entity()
export class Role {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => RoleName)
  @Column({type: 'enum', enum: RoleName, unique: true, nullable: false})
  name: string;

  @Field(() => [ModulePolicyRole], { nullable: true })
  @OneToMany(() => ModulePolicyRole, (rpm) => rpm.module)
  rolePolicyModule: ModulePolicyRole[];

  @Field(() => [Step], { nullable: true })
  @ManyToMany(() => Step, (step) => step.roles)
  @JoinTable({ name: 'roles_steps' })
  steps: Step[];

  @Field(() => [UserRoleClub], { nullable: true })
  @OneToMany(() => UserRoleClub, (userRoleClub) => userRoleClub.role)
  userRoleClub: UserRoleClub[];

  @Field()
  @CreateDateColumn()
  createdDate: Date;

  @Field()
  @UpdateDateColumn()
  updatedDate: Date;

  constructor(role: Partial<Role>) {
    Object.assign(this, role);
  }
}
