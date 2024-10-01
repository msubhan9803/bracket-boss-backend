import { Injectable } from '@nestjs/common';
import { EmailSenderStrategy } from '../abstracts/email-sender-strategy.interface';
import { MailerIdentifiers } from '../types/email-sender.types';
import { emailMessages } from 'src/utils/messages';

@Injectable()
export class EmailSenderService {
  constructor(private readonly emailSenderStrategy: EmailSenderStrategy) {}

  async sendUserRegistrationEmail(
    to: string,
    username: string,
    otp: string,
  ): Promise<void> {
    const subject = emailMessages.userRegistration.welcomeText;
    const template = MailerIdentifiers.USER_REGISTRATION;
    const data = { username, otp };

    await this.emailSenderStrategy.sendEmail(to, subject, template, data);
  }

  async sendForgotPasswordEmail(
    to: string,
    username: string,
    otp: string,
  ): Promise<void> {
    const subject = emailMessages.forgotPassword.subject;
    const template = MailerIdentifiers.FORGOT_PASSWORD;
    const data = { username, otp };

    await this.emailSenderStrategy.sendEmail(to, subject, template, data);
  }
}
