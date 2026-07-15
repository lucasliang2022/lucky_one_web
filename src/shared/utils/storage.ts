export const STORAGE_KEYS = {
    TOKEN:         'lc_token',
    REFRESH_TOKEN: 'lc_refresh_token',
    LANGUAGE:      'lc_language',
    CURRENCY:      'lc_currency',
    TIMEZONE:      'lc_timezone',
    COUNTRY:       'lc_country',
    USER_INFO:     'lc_user_info',
    DATA_VERSION:  'lc_data_version',
} as const;

export const storage = {
    get(key: string): string | null {
        try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key: string, value: string): void {
        try { localStorage.setItem(key, value); } catch { /* quota or disabled */ }
    },
    remove(key: string): void {
        try { localStorage.removeItem(key); } catch { /* */ }
    },
    getJSON<T = unknown>(key: string): T | null {
        const raw = this.get(key);
        if (!raw) return null;
        try { return JSON.parse(raw) as T; } catch { return null; }
    },
    setJSON(key: string, value: unknown): void {
        try { this.set(key, JSON.stringify(value)); } catch { /* */ }
    },
};