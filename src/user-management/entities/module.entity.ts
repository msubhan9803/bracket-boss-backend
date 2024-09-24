import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ModulePolicyRole } from './modules-policies-roles.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';

@ObjectType()
@Entity()
export class Module {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => [ModulePolicyRole], { nullable: true })
  @OneToMany(() => ModulePolicyRole, (rpm) => rpm.module)
  rolePolicyModule: ModulePolicyRole[];

  constructor(module: Partial<Module>) {
    Object.assign(this, module);
  }
}
