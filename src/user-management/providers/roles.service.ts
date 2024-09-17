import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

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
}
