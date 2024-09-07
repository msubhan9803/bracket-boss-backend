import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './providers/users.service';
import { CreateUserInput } from './dtos/create-user-input.dto';
import { InternalServerErrorException } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async getUsers() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    try {
      return await this.usersService.create(input);
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
