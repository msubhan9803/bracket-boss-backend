import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ClubsService } from './providers/clubs.service';
import { AuthCheckGuard } from 'src/auth/guards/auth-check.guard';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { CustomRequest } from 'src/auth/types/types';
import { CreateClubInputDto } from './dtos/create-club-input.dto';
import { CreateClubResponseDto } from './dtos/create-club-response.dto';
import messages from 'src/utils/messages';
import { UsersService } from 'src/users/providers/users.service';

@Resolver()
export class ClubsResolver {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly usersService: UsersService,
  ) {}

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

      return { message: messages.SUCCESS_MESSAGE, club: createdClub };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
