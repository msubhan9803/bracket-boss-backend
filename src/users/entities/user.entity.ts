import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Field, ObjectType, ID, HideField } from '@nestjs/graphql';
import { Club } from 'src/clubs/entities/club.entity';
import { Role } from 'src/user-management/entities/role.entity';
import { Step } from 'src/users-onboarding-steps/entities/step.entity';

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

  @HideField()
  @Column('varchar', { nullable: true })
  password: string;

  @Field({ nullable: true })
  @Column('varchar', { nullable: true })
  profileImage?: string;

  @Field({ defaultValue: false })
  @Column('varchar', { default: false })
  isEmailVerified: boolean;

  @ManyToMany(() => Club, (club) => club.users)
  @JoinTable({ name: 'clubs_users' })
  clubs: Club[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'roles_users' })
  roles: Role[];

  @Field()
  @Column('varchar')
  otpSecret: string;

  @ManyToMany(() => Step, (step) => step.users)
  @JoinTable({ name: 'steps_users' })
  steps: Step[];

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
