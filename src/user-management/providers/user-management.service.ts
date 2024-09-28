import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { ModulePolicyRole } from '../entities/modules-policies-roles.entity';
import { PermissionByRoleIdResponse } from '../dtos/permission-by-role-id-response.dto';

@Injectable()
export class UserManagementService {
  constructor(
    @InjectRepository(Role)
    private modulePolicyRoleRepository: Repository<ModulePolicyRole>,
  ) {}

  getPermissionsByRoleId(
    roleId: number,
  ): Promise<PermissionByRoleIdResponse[]> {
    return this.modulePolicyRoleRepository.query(
      `
        SELECT mpr.id, mpr."moduleId", mpr."policyId", p.name as "policyName", m.name as "moduleName"
        FROM public.modules_policies_roles mpr
        JOIN public.policy p ON mpr."policyId" = p.id
        JOIN public.module m ON mpr."moduleId" = m.id
        WHERE mpr."roleId" = $1;
    `,
      [roleId],
    );
  }
}
