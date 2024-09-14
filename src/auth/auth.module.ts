import { Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [UsersModule, EmailModule],
  providers: [AuthService, AuthResolver, JwtService],
})
export class AuthModule {}
