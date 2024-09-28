import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import messages from 'src/utils/messages';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  findOne(id: number): Promise<Role> {
    return this.roleRepository.findOneBy({ id });
  }

  findOneWithRelations(roleId: number, relations: string[]): Promise<Role> {
    return this.roleRepository.findOne({
      where: { id: roleId },
      relations,
    });
  }

  async update(id: number, updateUserInput: Partial<Role>): Promise<Role> {
    const user = await this.roleRepository.preload({
      id,
      ...updateUserInput,
    });
    if (!user) {
      throw new Error(messages.ROLE_NOT_FOUND);
    }
    return this.roleRepository.save(user);
  }
}
