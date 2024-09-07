import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
@Entity()
export class Club {
  @Field(() => ID)
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

  @ManyToMany(() => User, (user) => user.clubs)
  users: User[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  constructor(club: Partial<Club>) {
    Object.assign(this, club);
  }
}
