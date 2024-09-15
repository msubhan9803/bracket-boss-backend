import { Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { OtpModule } from 'src/otp/otp.module';
import { UsersOnboardingStepsModule } from 'src/users-onboarding-steps/users-onboarding-steps.module';

@Module({
  imports: [UsersModule, EmailModule, OtpModule, UsersOnboardingStepsModule],
  providers: [AuthService, AuthResolver, JwtService],
})
export class AuthModule {}
