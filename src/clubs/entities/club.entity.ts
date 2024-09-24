import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { CustomNumberIdScalar } from 'src/common/scalars/custom-number-id.scalar';

@ObjectType()
@Entity()
export class Club {
  @Field(() => CustomNumberIdScalar)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { unique: true })
  name: string;

  @Field()
  @Column('text')
  logo: string;

  @Field()
  @Column('varchar', { length: 255 })
  description: string;

  @Field()
  @Column('varchar')
  url: string;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.clubs)
  users: User[];

  @Field()
  @CreateDateColumn()
  createdDate: Date;

  @Field()
  @UpdateDateColumn()
  updatedDate: Date;

  constructor(club: Partial<Club>) {
    Object.assign(this, club);
  }
}
