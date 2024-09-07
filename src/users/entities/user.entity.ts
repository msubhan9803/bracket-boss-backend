import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Club } from 'src/clubs/entities/club.entity';
import { Role } from 'src/user-management/entities/role.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar')
  name: string;

  @Field()
  @Column('varchar', { unique: true })
  email: string;

  @Field()
  @Column('varchar', { nullable: true })
  password: string;

  @Field({ nullable: true })
  @Column('varchar', { nullable: true })
  profileImage?: string;

  @ManyToMany(() => Club, (club) => club.users)
  @JoinTable({ name: 'clubs_users' })
  clubs: Club[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'roles_users' })
  roles: Role[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
