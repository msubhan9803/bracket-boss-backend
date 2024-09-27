import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './providers/users.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { UpdateUserRoleDto } from './dtos/update-user-role-input.dto';
import { RolesService } from 'src/user-management/providers/roles.service';
import messages from 'src/utils/messages';
import { UsersOnboardingStepsService } from 'src/users-onboarding-steps/providers/users-onboarding-steps.service';
import { StepNames } from 'src/users-onboarding-steps/types/step.types';
import { CustomRequest } from 'src/auth/types/types';
import { UpdateUserResponseDto } from './dtos/update-user-response.dto';
import { UpdateUserClubDto } from './dtos/update-user-club-input.dto';
import { ClubsService } from 'src/clubs/providers/clubs.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly usersOnboardingStepsService: UsersOnboardingStepsService,
    private readonly clubsService: ClubsService,
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
  @Query(() => User)
  async getUserById(@Args('userId') userId: number) {
    try {
      const user = await this.usersService.findOneWithRelations(userId, [
        'clubs',
        'roles',
        'steps',
      ]);

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => UpdateUserResponseDto)
  async updateUserRole(
    @Args('input') updateUserRoleDto: UpdateUserRoleDto,
    @Context('req') req: CustomRequest,
  ) {
    const { roleId } = updateUserRoleDto;
    const userId = req.user.sub.id;

    try {
      const role = await this.rolesService.findOne(roleId);

      const updatedUser = await this.usersService.update(userId, {
        roles: [role],
      });

      /**
       * Onboarding step creation
       */
      await this.usersOnboardingStepsService.createOnboardingStep(
        userId,
        StepNames.user_type_selection,
      );

      return { message: messages.SUCCESS_MESSAGE, user: updatedUser };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => UpdateUserResponseDto)
  async updateUserClub(
    @Args('input') updateUserClubDto: UpdateUserClubDto,
    @Context('req') req: CustomRequest,
  ) {
    const { clubId } = updateUserClubDto;
    const userId = req.user.sub.id;

    try {
      const club = await this.clubsService.findOne(clubId);

      const updatedUser = await this.usersService.update(userId, {
        clubs: [club],
      });

      /**
       * Onboarding step creation
       */
      await this.usersOnboardingStepsService.createOnboardingStep(
        userId,
        StepNames.club_selection,
      );

      return { message: messages.SUCCESS_MESSAGE, user: updatedUser };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
