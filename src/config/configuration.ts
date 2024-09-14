export default () => ({
  port: parseInt(process.env.APP_PORT, 10) || 4000,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwt: {
    access: {
      secretKey: process.env.JWT_ACCESS_TOKEN_KEY,
      expiry: process.env.JWT_ACCESS_EXPIRY,
    },
    refresh: {
      secretKey: process.env.JWT_REFRESH_TOKEN_KEY,
      expiry: process.env.JWT_REFRESH_EXPIRY,
    },
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    auth: {
      user: process.env.SMTP_USERNAME,
      password: process.env.SMTP_PASSWORD,
    },
  },
  email: {
    // add more i.e. info email, contact or support etc.
    default: process.env.DEFAULT_EMAIL_FROM,
  },
});
