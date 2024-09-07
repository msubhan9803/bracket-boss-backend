import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ModulePolicyRole } from './modules-policies-roles.entity';

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

  @OneToMany(() => ModulePolicyRole, (rpm) => rpm.module)
  rolePolicyModule: ModulePolicyRole[];

  constructor(module: Partial<Module>) {
    Object.assign(this, module);
  }
}
