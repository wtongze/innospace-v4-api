import crypto from 'crypto';
import path from 'path';
import 'dotenv/config';

export const PROD = process.env.NODE_ENV === 'production';

export default {
  express: {
    /**
     * Session secret for `express-session`
     */
    SESSION_SECRET: crypto.randomBytes(20).toString('hex'),
    /**
     * Google OAuth2 Client ID
     */
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    /**
     * Google OAuth2 Client Secret
     */
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    /**
     * Google OAuth2 Callback URL
     */
    GOOGLE_CALLBACK_URL: PROD
      ? 'https://api.innospace.io/v4/auth/google'
      : 'http://localhost:4000/v4/auth/google',
    /**
     * Redirect URL for failed OAuth
     */
    OAUTH_FAIL_URL: PROD
      ? 'https://www.innospace.io/signin'
      : 'http://localhost:3000/signin',
    /**
     * Redirect URL for successful OAuth
     */
    OAUTH_SUCCESS_URL: PROD
      ? 'https://www.innospace.io/dashboard'
      : 'http://localhost:3000/dashboard',
    /**
     * Upload base path for multer
     */
    MULTER_BASE_PATH: path.resolve(__dirname, '../upload'),
  },
  sequelize: {
    USER_PASSWORD_PBKDF2_ITERATIONS: 100000,
    USER_PASSWORD_PBKDF2_KEY_LENGTH: 64,
    USER_PASSWORD_PBKDF2_DIGEST: 'sha512',
  },
};
