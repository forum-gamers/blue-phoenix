export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APPLICATION_URL: string;
      DATABASE_URL: string;
      SECRET: string;
      IMAGEKIT_PUBLIC_KEY: string;
      IMAGEKIT_PRIVATE_KEY: string;
      IMAGEKIT_ENDPOINT_URL: string;
    }
  }
}
