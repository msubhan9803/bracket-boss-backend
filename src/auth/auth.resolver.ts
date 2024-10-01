import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
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
import { MessageResponseDto } from '../common/dtos/message-response.dto';
import messages from 'src/utils/messages';
import { EmailSenderService } from 'src/email/providers/email-sender.service';
import { OtpService } from 'src/otp/providers/otp.service';
import { UsersOnboardingStepsService } from 'src/users-onboarding-steps/providers/users-onboarding-steps.service';
import { StepNames } from 'src/users-onboarding-steps/types/step.types';
import { AuthCheckGuard } from './guards/auth-check.guard';
import { VerifyEmailInputDto } from './dtos/verify-email-input.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly emailSenderService: EmailSenderService,
    private readonly otpService: OtpService,
    private readonly usersOnboardingStepsService: UsersOnboardingStepsService,
  ) {}

  @Mutation(() => MessageResponseDto)
  async register(@Args('input') registerInput: RegisterInputDto) {
    try {
      const user = await this.usersService.findOneByEmail(registerInput.email);
      if (user) {
        throw new ConflictException(messages.USER_ALREADY_EXISTS);
      }

      /**
       * User Creation
       */
      const otpSecret = this.otpService.generateSecret();
      const createdUser = await this.usersService.create({
        ...registerInput,
        otpSecret,
      });

      /**
       * Verification Email
       */
      const emailVerificationOtp = this.otpService.generateOtp(otpSecret);
      await this.emailSenderService.sendUserRegistrationEmail(
        createdUser.email,
        createdUser.name,
        emailVerificationOtp,
      );

      /**
       * Onboarding step creation
       */
      await this.usersOnboardingStepsService.createOnboardingStep(
        createdUser.id,
        StepNames.registration,
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

  @UseGuards(AuthCheckGuard)
  @Mutation(() => MessageResponseDto)
  async verifyEmail(@Args('input') verifyEmailInput: VerifyEmailInputDto) {
    try {
      const user = await this.usersService.findOneByEmail(
        verifyEmailInput.email,
      );
      if (!user) {
        throw new NotFoundException(messages.USER_NOT_FOUND);
      }

      const isOTPValid = this.otpService.validateOtp(
        verifyEmailInput.otp,
        user.otpSecret,
      );
      if (!isOTPValid) {
        /**
         * OTP is expired
         * Sending new email verification otp
         */
        const emailVerificationOtp = this.otpService.generateOtp(
          user.otpSecret,
        );
        await this.emailSenderService.sendUserRegistrationEmail(
          user.email,
          user.name,
          emailVerificationOtp,
        );

        throw new NotFoundException(messages.EMAIL_VERIFICATION_OTP_EXPIRED);
      }

      await this.authService.verifyEmail(user.id);

      /**
       * Onboarding step creation
       */
      await this.usersOnboardingStepsService.createOnboardingStep(
        user.id,
        StepNames.email_verification,
      );

      return { message: messages.EMAIL_VERIFICATION_SUCCESSFULL };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }

  @Mutation(() => MessageResponseDto)
  async sendForgotPasswordEmail(@Args('email') email: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new NotFoundException(messages.USER_NOT_FOUND);
      }

      const otp = this.otpService.generateOtp(user.otpSecret);
      await this.emailSenderService.sendForgotPasswordEmail(
        user.email,
        user.name,
        otp,
      );

      return { message: messages.FORGOT_PASSWORD_EMAIL_SENT };
    } catch (error) {
      throw new InternalServerErrorException('Error: ', error.message);
    }
  }
}
