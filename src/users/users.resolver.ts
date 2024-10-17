import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './providers/users.service';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { UpdateUserRoleDto } from './dtos/update-user-role-input.dto';
import messages from 'src/utils/messages';
import { UsersOnboardingStepsService } from 'src/users-onboarding-steps/providers/users-onboarding-steps.service';
import { StepNames } from 'src/users-onboarding-steps/types/step.types';
import { CustomRequest } from 'src/auth/types/types';
import { UpdateUserResponseDto } from './dtos/update-user-response.dto';
import { UpdateUserClubDto } from './dtos/update-user-club-input.dto';
import { ClubsService } from 'src/clubs/providers/clubs.service';
import { UserManagementService } from 'src/user-management/providers/user-management.service';
import { UpdateUserRoleResponseDto } from './dtos/update-user-role-response.dto';
import { UserWithRoleClub } from './dtos/user-with-role-module.type';
import { UserListResponse } from './dtos/get-all-users-response.dto';
import { SortInput } from 'src/common/dtos/sort-input.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersOnboardingStepsService: UsersOnboardingStepsService,
    private readonly clubsService: ClubsService,
    private readonly userManagementService: UserManagementService,
  ) {}

  @UseGuards(AuthCheckGuard)
  @Query(() => [User])
  async getAllUsersWithoutPagination(
    @Args('userRole', { type: () => Number, nullable: true })
    userRole,
  ) {
    try {
      return await this.usersService.findAll(userRole);
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Query(() => UserListResponse)
  async getAllUsers(
    @Args('userRole', { type: () => Number, nullable: true })
    userRole,
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize = 10,
    @Args('filterBy', { type: () => String, nullable: true }) filterBy?: string,
    @Args('filter', { type: () => String, nullable: true }) filter?: string,
    @Args('sort', { type: () => SortInput, nullable: true })
    sort?: {
      field: string;
      direction: 'ASC' | 'DESC';
    },
  ) {
    try {
      const [users, totalRecords] =
        await this.usersService.findAllWithRelations({
          userRole,
          page,
          pageSize,
          filterBy,
          filter,
          sort,
        });

      return { users, totalRecords };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Query(() => UserWithRoleClub)
  async getUserById(
    @Args('userId') userId: number,
    @Args('clubId', { nullable: true }) clubId?: number,
  ) {
    try {
      const user = await this.usersService.findOneWithRelations(userId, [
        'clubs',
        'steps',
      ]);

      const userRoleClub = await this.userManagementService.findOneUserRoleClub(
        {
          userId: user.id,
          clubId: clubId ?? null,
        },
      );

      return { user, userRoleClub };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => UpdateUserRoleResponseDto)
  async updateUserRole(
    @Args('input') updateUserRoleDto: UpdateUserRoleDto,
    @Context('req') req: CustomRequest,
  ) {
    const { roleId } = updateUserRoleDto;
    const userId = req.user.sub.id;

    try {
      const userRoleClub =
        await this.userManagementService.addOrUpdateUserRoleClub(
          userId,
          roleId,
        );

      /**
       * Onboarding step creation
       */
      await this.usersOnboardingStepsService.createOnboardingStep(
        userId,
        StepNames.user_type_selection,
      );

      return {
        message: messages.SUCCESS_MESSAGE,
        userRoleClub,
      };
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

      /**
       * Updating role based on club selection
       */
      const { role } = await this.userManagementService.findOneUserRoleClub({
        userId,
      });

      const userRoleClub =
        await this.userManagementService.addOrUpdateUserRoleClub(
          userId,
          role.id,
          clubId,
        );

      return {
        message: messages.SUCCESS_MESSAGE,
        user: updatedUser,
        userRoleClub,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
