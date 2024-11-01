import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';
import { FormatType } from '../types/format.enums';

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

  constructor(format: Partial<Format>) {
    Object.assign(this, format);
  }
}
