import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Step } from '../entities/step.entity';
import { Repository } from 'typeorm';
import { StepNames } from '../types/step.types';

@Injectable()
export class UsersOnboardingStepsService {
  constructor(
    @InjectRepository(Step)
    private stepRepository: Repository<Step>,
  ) {}

  findOneByStepName(name: StepNames): Promise<Step> {
    return this.stepRepository.findOneBy({ name });
  }
}
