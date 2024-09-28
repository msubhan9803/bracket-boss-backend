import { forwardRef, Module as NestJsModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Policy } from './entities/policy.entity';
import { Module } from './entities/module.entity';
import { ModulePolicyRole } from './entities/modules-policies-roles.entity';
import { Action } from './entities/action.entity';
import { RolesService } from './providers/roles.service';
import { UserManagementResolver } from './user-management.resolver';
import { UserManagementService } from './providers/user-management.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { UserRoleClub } from './entities/user-role-club.entity';

@NestJsModule({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Policy,
      Module,
      ModulePolicyRole,
      Action,
      UserRoleClub,
    ]),
    forwardRef(() => UsersModule),
  ],
  providers: [
    UserManagementResolver,
    RolesService,
    UserManagementService,
    JwtService,
  ],
  exports: [RolesService, UserManagementService],
})
export class UserManagementModule {}
