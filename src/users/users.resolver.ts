import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './providers/users.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { UpdateUserRoleDto } from './dtos/update-user-role-input.dto';
import { RolesService } from 'src/user-management/providers/roles.service';
import messages from 'src/utils/messages';
import { UsersOnboardingStepsService } from 'src/users-onboarding-steps/providers/users-onboarding-steps.service';
import { StepNames } from 'src/users-onboarding-steps/types/step.types';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly usersOnboardingStepsService: UsersOnboardingStepsService,
  ) {}

  @UseGuards(AuthCheckGuard)
  @Query(() => [User])
  async getUsers() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => User)
  async updateUserRole(@Args('input') updateUserRoleDto: UpdateUserRoleDto) {
    const { userId, roleId } = updateUserRoleDto;

    try {
      const role = await this.rolesService.findOne(roleId);

      await this.usersService.update(userId, {
        roles: [role],
      });

      /**
       * Onboarding step creation
       */
      await this.usersOnboardingStepsService.createOnboardingStep(
        userId,
        StepNames.USER_TYPE_SELECTION,
      );

      return { message: messages.SUCCESS_MESSAGE };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
