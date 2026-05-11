interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_ENV_NAME: string;
    readonly VITE_SDK_SIGN: string;
    readonly VITE_DEFAULT_LANG: string;
    readonly VITE_DEFAULT_CURRENCY: string;
    readonly VITE_DEFAULT_TIMEZONE: string;
    readonly VITE_DEFAULT_COUNTRY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}