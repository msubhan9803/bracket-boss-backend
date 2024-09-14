import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class OtpService {
  generateOtp(secret: string, step: number = 600): number {
    const otp = speakeasy.totp({
      secret,
      encoding: 'base32',
      step,
      digits: 6,
    });
    return parseInt(otp, 10);
  }

  validateOtp(otp: string, secret: string, step: number = 600): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: otp,
      step,
    });
  }

  generateSecret(): string {
    return speakeasy.generateSecret({ length: 20 }).base32;
  }
}
