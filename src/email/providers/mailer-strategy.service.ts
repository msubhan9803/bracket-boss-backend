import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailSenderStrategy } from '../abstracts/email-sender-strategy.interface';

@Injectable()
export class MailerStrategyService implements EmailSenderStrategy {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    data: Record<string, any>,
  ): Promise<void> {
    await this.mailerService
      .sendMail({
        to,
        subject,
        template: `${template}.hbs`,
        context: data,
      })
      .then((res) => console.log('Success: ', res))
      .catch((err) => console.log(err));
  }
}
