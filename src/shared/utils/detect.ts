import { SUPPORTED_LOCALES, type SupportedLocale } from '@shared/types/i18n';

export function detectBrowserLanguage(): SupportedLocale | null {
    if (typeof navigator === 'undefined') return null;

    const candidates: string[] = [];
    if (navigator.language) candidates.push(navigator.language);
    if (navigator.languages) candidates.push(...navigator.languages);

    const primaryFallback: Record<string, SupportedLocale> = {
        zh: 'zh-CN', en: 'en', th: 'th', vi: 'vi', hi: 'hi',
        pt: 'pt', tl: 'fil', fil: 'fil', id: 'id',
    };

    for (const raw of candidates) {
        if (SUPPORTED_LOCALES.includes(raw as SupportedLocale)) {
            return raw as SupportedLocale;
        }
        const main = raw.split('-')[0].toLowerCase();
        if (primaryFallback[main]) {
            return primaryFallback[main];
        }
    }
    return null;
}

export function detectBrowserCountry(): string | null {
    if (typeof navigator === 'undefined') return null;
    const raw = navigator.language || '';
    const parts = raw.split('-');
    if (parts.length < 2) return null;

    const code = parts[1].toUpperCase();
    return /^[A-Z]{2}$/.test(code) ? code : null;
}

export function detectBrowserTimezone(): string | null {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return tz || null;
    } catch {
        return null;
    }
}
