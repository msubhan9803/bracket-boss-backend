import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PermissionByRoleIdResponse {
  @Field()
  id: string;

  @Field()
  moduleId: string;

  @Field()
  moduleName: string;

  @Field()
  policyId: string;

  @Field()
  policyName: string;
}
