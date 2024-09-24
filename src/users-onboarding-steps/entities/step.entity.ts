import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/user-management/entities/role.entity';
import { StepNames } from '../types/step.types';

registerEnumType(StepNames, {
  name: 'StepNames',
});

@ObjectType()
@Entity()
export class Step {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => StepNames)
  @Column({
    type: 'enum',
    enum: StepNames,
    default: StepNames.REGISTRATION,
    unique: true,
  })
  name: StepNames;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.steps)
  users: User[];

  @Field(() => [Role], { nullable: true })
  @ManyToMany(() => Role, (role) => role.steps)
  roles: Role[];

  @Field()
  @CreateDateColumn()
  createdDate: Date;

  @Field()
  @UpdateDateColumn()
  updatedDate: Date;

  constructor(action: Partial<Step>) {
    Object.assign(this, action);
  }
}
