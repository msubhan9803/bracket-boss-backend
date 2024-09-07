import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { RolePolicyModule } from './role-policy-module.entity';

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

  @OneToMany(() => RolePolicyModule, (rpm) => rpm.module)
  rolePolicyModule: RolePolicyModule[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  constructor(role: Partial<Role>) {
    Object.assign(this, role);
  }
}
