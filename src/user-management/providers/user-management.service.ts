import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { ModulePolicyRole } from '../entities/modules-policies-roles.entity';
import { PermissionByRoleIdResponse } from '../dtos/permission-by-role-id-response.dto';
import { UserRoleClub } from '../entities/user-role-club.entity';

@Injectable()
export class UserManagementService {
  constructor(
    @InjectRepository(Role)
    private modulePolicyRoleRepository: Repository<ModulePolicyRole>,
    @InjectRepository(UserRoleClub)
    private userRoleClubRepository: Repository<UserRoleClub>,
  ) {}

  getPermissionsByRoleId(
    roleId: number,
  ): Promise<PermissionByRoleIdResponse[]> {
    return this.modulePolicyRoleRepository.query(
      `
        SELECT mpr."id" as id, mpr."roleId", mpr."moduleId", m."name" as "moduleName", mpr."policyId", p."name" as "policyName"
        FROM "modules_policies_roles" mpr

        JOIN "module" m
        ON mpr."moduleId" = m.id

        JOIN "policy" p
        ON mpr."policyId" = p.id

        WHERE "roleId" = $1;
    `,
      [roleId],
    );
  }

  async findOneUserRoleClub({
    userId,
    roleId,
    clubId,
  }: {
    userId?: number;
    roleId?: number;
    clubId?: number | null;
  }): Promise<UserRoleClub | null> {
    return this.userRoleClubRepository.findOne({
      where: {
        user: userId ? { id: userId } : null,
        role: roleId ? { id: roleId } : null,
        club: clubId ? { id: clubId } : null,
      },
      relations: ['user', 'role', 'club'],
    });
  }

  async addOrUpdateUserRoleClub(
    userId: number,
    roleId: number,
    clubId?: number | null,
  ): Promise<UserRoleClub> {
    const existingUserRoleClub = await this.findOneUserRoleClub({
      userId,
    });

    if (existingUserRoleClub) {
      const userRoleClubTemp = existingUserRoleClub as any;
      userRoleClubTemp.user = { id: userId };
      userRoleClubTemp.role = { id: roleId };
      userRoleClubTemp.club = clubId ? { id: clubId } : null;

      await this.userRoleClubRepository.save(userRoleClubTemp);

      return existingUserRoleClub;
    }

    const userRoleClub = this.userRoleClubRepository.create({
      user: { id: userId },
      role: { id: roleId },
      club: clubId ? { id: clubId } : null,
    });

    await this.userRoleClubRepository.save(userRoleClub);

    return this.findOneUserRoleClub({ userId, roleId, clubId });
  }
}
