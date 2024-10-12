import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsInt } from 'class-validator';

@InputType()
export class CreateCourtInputDto {
  @Field()
  @IsString({ message: 'Name is required' })
  name: string;

  @Field()
  @IsString({ message: 'Location is required' })
  location: string;

  @Field()
  @IsInt({ message: 'Club ID must be an integer' })
  clubId: number;
}
