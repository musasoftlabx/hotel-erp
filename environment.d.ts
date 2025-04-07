declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_ADMIN: string;

      FS_URL: string;
      REDIS_DB_HOST: string;
      REDIS_DB_PORT: number;
      REDIS_KEY_EXPIRY: number;
      ACCESS_TOKEN: string;
      OTP_TOKEN: string;
      ACCESS_TOKEN_EXPIRY: string;
      NEXT_PUBLIC_URL: string;
      RESET_HASH_EXPIRY: number;
      OTP_EXPIRY: number;
      LOCKED_ACCOUNT_EXPIRY: number;
      MAX_LOGIN_ATTEMPTS: number;
      MAX_OTPS_TO_SEND: number;
      API_RETRY_TIMEOUT: number;
      NEXT_PUBLIC_LOGOUT_TIMEOUT: string;
    }
  }
}

export {};
