export default {
  INVALID_CREDENTIALS: 'Email or password in incorrect',
  VERIFY_YOUR_EMAIL:
    'You are successfully registered. Please check your email to verify your account',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  USER_NOT_FOUND_BY_USER_ID: (userId: number) =>
    `User with ID ${userId} not found`,
  EMAIL_VERIFICATION_OTP_EXPIRED:
    'OTP expired. A new OTP has been sent to your email',
  EMAIL_VERIFICATION_SUCCESSFULL: 'Email has been verified',
};

export const emailMessages = {
  userRegistration: {
    welcomeText: 'Welcome to Our App!',
  },
};
