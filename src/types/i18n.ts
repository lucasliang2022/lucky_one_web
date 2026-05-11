export const SUPPORTED_LOCALES = [
    'zh-CN', 'zh-TW', 'en', 'th', 'vi', 'hi', 'pt', 'fil', 'id',
] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export interface LocaleDict {
    readonly [key: string]: string | LocaleDict;
}

/**
 * 翻译树结构。文件路径 = key 前缀。
 * 例：locales/zh-CN/pages/login.json 内容直接是 leaf dict，
 *     访问方式 t('pages.login.enterUsername')
 */
export interface Translation {
    common: {
        service: LocaleDict;
        [k: string]: LocaleDict;
    };
    components: {
        nav: LocaleDict;
        [k: string]: LocaleDict;
    };
    pages: {
        login: LocaleDict;
        lottery: LocaleDict;
        [k: string]: LocaleDict;
    };
    lottery: {
        layout: LocaleDict;
        ssc?: LocaleDict;
        lhc?: LocaleDict;
        pk10?: LocaleDict;
        [gameSign: string]: LocaleDict | undefined;
    };
}

export type Messages = Partial<Record<SupportedLocale, Translation>>;

declare module 'vue-i18n' {
    export interface DefineLocaleMessage extends Translation {}
}