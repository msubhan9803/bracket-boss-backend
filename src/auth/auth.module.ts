import { Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule],
  providers: [AuthService, AuthResolver, JwtService],
})
export class AuthModule {}
