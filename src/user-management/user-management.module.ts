import { Module as NestJsModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Policy } from './entities/policy.entity';
import { Module } from './entities/module.entity';
import { RolePolicyModule } from './entities/role-policy-module.entity';
import { Action } from './entities/action.entity';

@NestJsModule({
  imports: [
    TypeOrmModule.forFeature([Role, Policy, Module, RolePolicyModule, Action]),
  ],
  providers: [],
})
export class UserManagementModule {}
