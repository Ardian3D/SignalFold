/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_DATA_MODE: 'mock' | 'base44';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
