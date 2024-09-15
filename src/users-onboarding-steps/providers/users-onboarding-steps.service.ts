import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Step } from '../entities/step.entity';
import { Repository } from 'typeorm';
import { StepNames } from '../types/step.types';
import { User } from 'src/users/entities/user.entity';
import messages from 'src/utils/messages';

@Injectable()
export class UsersOnboardingStepsService {
  constructor(
    @InjectRepository(Step)
    private stepRepository: Repository<Step>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAlByRole(): Promise<Step[]> {
    return this.stepRepository.find();
  }

  findOneByStepName(name: StepNames): Promise<Step> {
    return this.stepRepository.findOneBy({ name });
  }

  async findStepsOfUser(userId: number): Promise<Step[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['steps'],
    });

    if (!user) {
      throw new NotFoundException(messages.USER_NOT_FOUND_BY_USER_ID(user.id));
    }

    return user.steps;
  }
}
