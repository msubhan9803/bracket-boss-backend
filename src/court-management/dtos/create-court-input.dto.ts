import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsInt, IsOptional } from 'class-validator';

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

  @Field({ nullable: true })
  @IsInt({ message: 'Court length must be an integer' })
  @IsOptional()
  courtLength?: number;

  @Field({ nullable: true })
  @IsInt({ message: 'Court width must be an integer' })
  @IsOptional()
  courtWidth?: number;
}
