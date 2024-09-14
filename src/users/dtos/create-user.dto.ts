import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email is required' })
  email: string;

  @IsString({ message: 'Name is required' })
  name: string;

  @IsStrongPassword({}, { message: 'Password is required' })
  password: string;

  @IsString()
  otpSecret: string;
}
