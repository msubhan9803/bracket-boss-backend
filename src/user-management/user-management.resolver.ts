import { Args, Query, Resolver } from '@nestjs/graphql';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { UserManagementService } from './providers/user-management.service';
import { PermissionByRoleIdResponse } from './dtos/permission-by-role-id-response.dto';

@Resolver()
export class UserManagementResolver {
  constructor(private readonly userManagementService: UserManagementService) {}

  @UseGuards(AuthCheckGuard)
  @Query(() => [PermissionByRoleIdResponse])
  async getPermissionsByRoleId(@Args('roleId') roleId: number) {
    try {
      const userPermissions =
        await this.userManagementService.getPermissionsByRoleId(roleId);

      return userPermissions;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
