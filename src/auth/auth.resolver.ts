import {
  ConflictException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from 'src/users/providers/users.service';
import { LoginInputDto } from './dtos/login-input.dto';
import { AuthService } from './providers/auth.service';
import { RegisterInputDto } from './dtos/register-input.dto';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { RefreshTokenResponseDto } from './dtos/refresh-token-response.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { RegisterResponseDto } from './dtos/register-response.dto';
import messages from 'src/utils/messages';
import { EmailSenderService } from 'src/email/providers/email-sender.service';
import { OtpService } from 'src/otp/providers/otp.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly emailSenderService: EmailSenderService,
    private readonly otpService: OtpService,
  ) {}

  @Mutation(() => RegisterResponseDto)
  async register(@Args('input') registerInput: RegisterInputDto) {
    try {
      const user = await this.usersService.findOneByEmail(registerInput.email);
      if (user) {
        throw new ConflictException(messages.USER_ALREADY_EXISTS);
      }

      const otpSecret = this.otpService.generateSecret();

      const createdUser = await this.usersService.create({
        ...registerInput,
        otpSecret,
      });

      const emailVerificationOtp = this.otpService.generateOtp(otpSecret);

      await this.emailSenderService.sendUserRegistration(
        createdUser.email,
        createdUser.name,
        emailVerificationOtp,
      );

      return { message: messages.VERIFY_YOUR_EMAIL };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @Mutation(() => LoginResponseDto)
  async login(@Args('input') loginInput: LoginInputDto) {
    try {
      return await this.authService.login(loginInput);
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @UseGuards(RefreshJwtGuard)
  @Mutation(() => RefreshTokenResponseDto)
  async refreshToken(@Context('req') req) {
    try {
      return await this.authService.refreshToken(req.user);
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
