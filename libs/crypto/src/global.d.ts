declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CRYPTO_SALT_ROUNDS?: string;
    }
  }
}

export {};
