import { IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateClubInputDto {
  @Field()
  @IsString({ message: 'Name is required' })
  name: string;

  @Field()
  @IsString({ message: 'Description is required' })
  description: string;

  @Field()
  @IsString({ message: 'Description is required' })
  logo: string;

  @Field()
  @IsString({ message: 'Url is required' })
  slug: string;
}
