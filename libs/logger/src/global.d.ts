declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LOGGER_LOG_LEVELS?: string;
      LOGGER_FORMATTER?: string;
      LOGGER_SERVICE_NAME?: string;
    }
  }
}

export {};
