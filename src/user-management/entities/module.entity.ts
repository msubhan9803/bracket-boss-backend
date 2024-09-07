import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RolePolicyModule } from './role-policy-module.entity';

@Entity()
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => RolePolicyModule, (rpm) => rpm.module)
  rolePolicyModule: RolePolicyModule[];

  constructor(module: Partial<Module>) {
    Object.assign(this, module);
  }
}
