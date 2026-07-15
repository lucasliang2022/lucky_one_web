import { createI18n } from 'vue-i18n';
import type { Composer } from 'vue-i18n';
import {
    SUPPORTED_LOCALES,
    type SupportedLocale,
    type Messages,
    type Translation,
    type LocaleDict,
} from '@shared/types/i18n';
import { storage, STORAGE_KEYS } from '@shared/utils/storage';

/* =========================================================
 * 自动扫描 ./locales/*\/**\/*.json
 * 文件路径 = i18n key 前缀（不含扩展名）
 * 例：locales/zh-CN/pages/login.json → t('pages.login.xxx')
 * ========================================================= */
const localeFiles = import.meta.glob<{ default: LocaleDict }>(
    './locales/*/**/*.json',
    { eager: true },
);

function buildMessages(): Messages {
    const messages: Messages = {};

    for (const [filePath, mod] of Object.entries(localeFiles)) {
        // ./locales/zh-CN/pages/login.json
        const match = filePath.match(/^\.\/locales\/([^/]+)\/(.+)\.json$/);
        if (!match) continue;

        const [, locale, keyPath] = match;
        if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
            if (import.meta.env.DEV) {
                console.warn(`[i18n] Locale folder "${locale}" not in SUPPORTED_LOCALES, skipped.`);
            }
            continue;
        }

        const segments = keyPath.split('/');
        const tree = (messages[locale as SupportedLocale] ??= {} as Translation);

        let cursor: Record<string, any> = tree as any;
        for (let i = 0; i < segments.length - 1; i++) {
            cursor[segments[i]] ??= {};
            cursor = cursor[segments[i]];
        }
        cursor[segments[segments.length - 1]] = mod.default;
    }

    if (import.meta.env.DEV) {
        const have = new Set(Object.keys(messages));
        for (const lang of SUPPORTED_LOCALES) {
            if (!have.has(lang)) {
                console.warn(`[i18n] No translations found for locale "${lang}".`);
            }
        }
    }

    return messages;
}

const messages = buildMessages();

/* =========================================================
 * 初始 locale
 * 优先级：localStorage > VITE_DEFAULT_LANG > navigator.language > 'en'
 * ========================================================= */
function normalizeLocale(raw: string): SupportedLocale {
    if (SUPPORTED_LOCALES.includes(raw as SupportedLocale)) {
        return raw as SupportedLocale;
    }
    const main = raw.split('-')[0];
    const fallback: Record<string, SupportedLocale> = {
        zh: 'zh-CN', en: 'en', th: 'th', vi: 'vi', hi: 'hi',
        pt: 'pt', fil: 'fil', tl: 'fil', id: 'id',
    };
    return fallback[main] ?? 'en';
}

function detectInitialLocale(): SupportedLocale {
    const stored = storage.get(STORAGE_KEYS.LANGUAGE);
    if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
        return stored as SupportedLocale;
    }
    const env = import.meta.env.VITE_DEFAULT_LANG as string | undefined;
    if (env && SUPPORTED_LOCALES.includes(env as SupportedLocale)) {
        return env as SupportedLocale;
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
        return normalizeLocale(navigator.language);
    }
    return 'en';
}

const initialLocale = detectInitialLocale();

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: initialLocale,
    fallbackLocale: 'en',
    messages,
});

export async function loadInitialLocale(): Promise<void> {
    document.documentElement.lang = initialLocale;
}

export async function switchLanguage(lang: SupportedLocale): Promise<void> {
    if (!SUPPORTED_LOCALES.includes(lang)) {
        console.error(`[i18n] Unsupported locale: ${lang}`);
        return;
    }
    (i18n.global as Composer).locale.value = lang;
    storage.set(STORAGE_KEYS.LANGUAGE, lang);
    document.documentElement.lang = lang;
}

const composer = i18n.global as Composer;
export const t = (key: string, named?: Record<string, unknown>): string =>
    named ? composer.t(key, named) : composer.t(key);

export default i18n;