import { Args, Context, Query, Mutation, Resolver } from '@nestjs/graphql';
import { ClubsService } from './providers/clubs.service';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { CustomRequest } from 'src/auth/types/types';
import { CreateClubInputDto } from './dtos/create-club-input.dto';
import { CreateClubResponseDto } from './dtos/create-club-response.dto';
import messages from 'src/utils/messages';
import { UsersService } from 'src/users/providers/users.service';
import { UsersOnboardingStepsService } from 'src/users-onboarding-steps/providers/users-onboarding-steps.service';
import { StepNames } from 'src/users-onboarding-steps/types/step.types';
import { Club } from './entities/club.entity';

@Resolver(() => Club)
export class ClubsResolver {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly usersService: UsersService,
    private readonly usersOnboardingStepsService: UsersOnboardingStepsService,
  ) {}

  @Query(() => [Club])
  async getAllClubs() {
    try {
      return await this.clubsService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(AuthCheckGuard)
  @Mutation(() => CreateClubResponseDto)
  async createClub(
    @Args('input') createClubInputDto: CreateClubInputDto,
    @Context('req') req: CustomRequest,
  ) {
    const userId = req.user.sub.id;

    try {
      const user = await this.usersService.findOne(userId);

      const createdClub = await this.clubsService.create({
        ...createClubInputDto,
        users: [user],
      });

      /**
       * Onboarding step creation
       */
      await this.usersOnboardingStepsService.createOnboardingStep(
        userId,
        StepNames.CLUB_INFORMATION_INSERTION,
      );

      return { message: messages.SUCCESS_MESSAGE, club: createdClub };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
