import { Module } from '@nestjs/common';
import * as path from 'path';
import { EmailSenderService } from './providers/email-sender.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailSenderStrategy } from './abstracts/email-sender-strategy.interface';
import { MailerStrategyService } from './providers/mailer-strategy.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('SMTP_HOST'),
          port: configService.getOrThrow<string>('SMTP_PORT'),
          auth: {
            user: configService.getOrThrow<string>('SMTP_USERNAME'),
            pass: configService.getOrThrow<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"The Bracket Boss" ${configService.getOrThrow<string>('DEFAULT_EMAIL_FROM')}`,
        },
        template: {
          dir: path.resolve('src/email/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [
    {
      provide: EmailSenderStrategy,
      useClass: MailerStrategyService,
    },
    EmailSenderService,
  ],
  exports: [EmailSenderService],
})
export class EmailModule {}
