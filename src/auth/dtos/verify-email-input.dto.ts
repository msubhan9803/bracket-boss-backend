import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNumber } from 'class-validator';

@InputType()
export class VerifyEmailInputDto {
  @Field()
  @IsEmail({}, { message: 'Email is required' })
  email: string;

  @Field()
  @IsNumber({}, { message: 'OTP is required' })
  otp: number;
}
