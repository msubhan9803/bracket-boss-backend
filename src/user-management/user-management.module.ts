import { Module as NestJsModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Policy } from './entities/policy.entity';
import { Module } from './entities/module.entity';
import { ModulePolicyRole } from './entities/modules-policies-roles.entity';
import { Action } from './entities/action.entity';

@NestJsModule({
  imports: [
    TypeOrmModule.forFeature([Role, Policy, Module, ModulePolicyRole, Action]),
  ],
  providers: [],
})
export class UserManagementModule {}
