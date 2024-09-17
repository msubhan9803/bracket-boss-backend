import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Step } from '../entities/step.entity';
import { Repository } from 'typeorm';
import { StepNames } from '../types/step.types';
import messages from 'src/utils/messages';
import { UsersService } from 'src/users/providers/users.service';
import { RolesService } from 'src/user-management/providers/roles.service';

@Injectable()
export class UsersOnboardingStepsService {
  constructor(
    @InjectRepository(Step)
    private stepRepository: Repository<Step>,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async findAlByRole(roleId: number): Promise<Step[]> {
    const role = await this.rolesService.findOneWithRelations(roleId, [
      'steps',
    ]);

    return role.steps;
  }

  findOneByStepName(name: StepNames): Promise<Step> {
    return this.stepRepository.findOneBy({ name });
  }

  async findStepsOfUser(userId: number): Promise<Step[]> {
    const user = await this.usersService.findOneWithRelations(userId, [
      'steps',
    ]);

    if (!user) {
      throw new NotFoundException(messages.USER_NOT_FOUND_BY_USER_ID(user.id));
    }

    return user.steps;
  }

  async createOnboardingStep(userId: number, stepName: StepNames) {
    const step = await this.findOneByStepName(stepName);
    const user = await this.usersService.findOneWithRelations(userId, [
      'steps',
    ]);
    user.steps = [...(user.steps || []), step];

    return this.usersService.update(userId, user);
  }
}
