import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import configuration from './config/configuration';
import { validateEnvVariables } from './config/env.validation';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { ClubsModule } from './clubs/clubs.module';
import { UserManagementModule } from './user-management/user-management.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { OtpModule } from './otp/otp.module';
import { UsersOnboardingStepsModule } from './users-onboarding-steps/users-onboarding-steps.module';
import { CustomNumberIdScalar } from './common/scalars/custom-number-id.scalar';
import { FileUploadModule } from './file-upload/file-upload.module';
import { TournamentManagementModule } from './tournament-management/tournament-management.module';
import { SportManagementModule } from './sport-management/sport-management.module';
import { FormatManagementModule } from './format-management/format-management.module';
import { CourtManagementModule } from './court-management/court-management.module';
import { TeamManagementModule } from './team-management/team-management.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { TeamGenerationTypeManagementModule } from './team-generation-type-management/team-generation-type-management.module';
import { MatchManagementModule } from './match-management/match-management.module';
import { CommonModule } from './common/common.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      validate: validateEnvVariables,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.getOrThrow<string>('DB_HOST'),
          port: configService.getOrThrow<number>('DB_PORT'),
          username: configService.getOrThrow<string>('DB_USERNAME'),
          password: configService.getOrThrow<string>('DB_PASSWORD'),
          database: configService.getOrThrow<string>('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: ENV === 'development',
          // logging: true,
          // logger: 'advanced-console',
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      playground: false,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      resolvers: { CustomID: CustomNumberIdScalar },
    }),
    UsersModule,
    ClubsModule,
    UserManagementModule,
    AuthModule,
    EmailModule,
    OtpModule,
    UsersOnboardingStepsModule,
    FileUploadModule,
    TournamentManagementModule,
    SportManagementModule,
    FormatManagementModule,
    TeamGenerationTypeManagementModule,
    CourtManagementModule,
    TeamManagementModule,
    SchedulingModule,
    MatchManagementModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
