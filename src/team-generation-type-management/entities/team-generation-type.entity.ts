import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { TeamGenerationTypeEnum } from '../types/team-generation-type.enums';
import { Format } from 'src/format-management/entities/format.entity';

registerEnumType(TeamGenerationTypeEnum, {
  name: 'TeamGenerationTypeEnum',
});

@ObjectType()
@Entity()
export class TeamGenerationType {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => TeamGenerationTypeEnum)
  @Column('varchar', { unique: true })
  name: TeamGenerationTypeEnum;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => [Format])
  @ManyToMany(() => Format, (format) => format.teamGenerationTypes)
  formats: Format[];

  constructor(teamGenerationType: Partial<TeamGenerationType>) {
    Object.assign(this, teamGenerationType);
  }
}
