/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_DATA_MODE: 'mock' | 'base44';
  readonly VITE_BASE44_APP_ID?: string;
  readonly VITE_BASE44_USE_LOCAL_DEV?: string;
  readonly VITE_BASE44_LOCAL_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
