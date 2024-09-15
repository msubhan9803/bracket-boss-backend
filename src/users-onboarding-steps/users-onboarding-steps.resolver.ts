import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersOnboardingStepsService } from './providers/users-onboarding-steps.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { StepsOfUserDto } from 'src/users/dtos/steps-of-user-input.dto';
import { Step } from './entities/step.entity';
import { StepsByRoleDto } from 'src/users/dtos/steps-by-role-input.dto';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';

@Resolver()
export class UsersOnboardingStepsResolver {
  constructor(
    private readonly usersOnboardingStepsService: UsersOnboardingStepsService,
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
  async getStepsOfUser(@Args('input') stepsOfUserDto: StepsOfUserDto) {
    try {
      return await this.usersOnboardingStepsService.findStepsOfUser(
        stepsOfUserDto.userId,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
