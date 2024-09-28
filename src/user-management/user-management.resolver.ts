import { Context, Query, Resolver } from '@nestjs/graphql';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { UserManagementService } from './providers/user-management.service';
import { PermissionByRoleIdResponse } from './dtos/permission-by-role-id-response.dto';
import { CustomRequest } from 'src/auth/types/types';
import { UsersService } from 'src/users/providers/users.service';

@Resolver()
export class UserManagementResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly userManagementService: UserManagementService,
  ) {}

  @UseGuards(AuthCheckGuard)
  @Query(() => [PermissionByRoleIdResponse])
  async getPermissionsByRoleId(@Context('req') req: CustomRequest) {
    try {
      const userId = req.user.sub.id;
      const userDetails = await this.usersService.findOneWithRelations(userId, [
        'roles',
      ]);

      const userPermissions =
        await this.userManagementService.getPermissionsByRoleId(
          userDetails.roles[0].id,
        );

      return userPermissions;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
