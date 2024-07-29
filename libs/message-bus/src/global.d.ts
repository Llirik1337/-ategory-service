declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NATS_URL?: string;
      NATS_QUEUE?: string;
    }
  }
}

export {};
