import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { SplitSwitchGroupByEnum } from 'src/scheduling/types/common';
import { IsOptional } from 'class-validator';
import { SecurityGroupType } from '../types/common';

registerEnumType(SplitSwitchGroupByEnum, {
  name: 'SplitSwitchGroupByEnum',
});

@ObjectType()
@Entity()
export class SecurityGroup {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar')
  name: string;

  @Field(() => SecurityGroupType, { nullable: true })
  @IsOptional()
  @Column('varchar', { nullable: true })
  type: SecurityGroupType;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(securityGroup: Partial<SecurityGroup>) {
    Object.assign(this, securityGroup);
  }
}
