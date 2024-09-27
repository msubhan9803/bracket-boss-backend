import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { UsersOnboardingStepsService } from './providers/users-onboarding-steps.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { Step } from './entities/step.entity';
import { StepsByRoleDto } from 'src/users/dtos/steps-by-role-input.dto';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { CustomRequest } from 'src/auth/types/types';
import { UsersService } from 'src/users/providers/users.service';

@Resolver()
export class UsersOnboardingStepsResolver {
  constructor(
    private readonly usersOnboardingStepsService: UsersOnboardingStepsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthCheckGuard)
  @Query(() => [Step])
  async getAllStepsByRole(@Args('input') stepsByRoleDto: StepsByRoleDto) {
    try {
      return await this.usersOnboardingStepsService.findAlByRole(
        stepsByRoleDto.roleId,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Query(() => [Step])
  async getStepsOfUser(@Context('req') req: CustomRequest) {
    const userId = req.user.sub.id;

    try {
      const user = await this.usersService.findOne(userId);
      const userSteps = await this.usersOnboardingStepsService.findStepsOfUser(
        user.id,
      );

      return userSteps;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
