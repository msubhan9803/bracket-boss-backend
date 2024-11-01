import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { FormatType } from '../types/format.enums';
import { TeamGenerationType } from 'src/team-generation-type-management/entities/team-generation-type.entity';

registerEnumType(FormatType, {
  name: 'FormatType',
});

@ObjectType()
@Entity()
export class Format {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => FormatType)
  @Column('varchar', { unique: true })
  name: FormatType;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field(() => [TeamGenerationType])
  @ManyToMany(
    () => TeamGenerationType,
    (teamGenerationType) => teamGenerationType.formats,
  )
  @JoinTable({ name: 'format_team_generation_types' })
  teamGenerationTypes: TeamGenerationType[];

  constructor(format: Partial<Format>) {
    Object.assign(this, format);
  }
}
