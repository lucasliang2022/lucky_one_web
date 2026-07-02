import type { ThemeManifest } from '@/theme/types';

/**
 * 主题自动发现:src/theme/themes/<主题名>/index.ts 一律 eager 加载。
 * 新增一套主题 = 新建一个文件夹 + 一个 index.ts,**无需改任何核心文件**。
 */
const modules = import.meta.glob('./themes/*/index.ts', { eager: true }) as Record<
  string,
  { default: ThemeManifest }
>;

export const THEMES: Record<string, ThemeManifest> = {};
for (const path in modules) {
  const m = path.match(/\/themes\/([^/]+)\/index\.ts$/);
  if (m) THEMES[m[1]] = modules[path].default;
}

/**
 * 注入皮肤 token:整块替换 <style id="lc-theme-tokens">,
 * 切主题时旧覆盖自动清空、未覆盖项回退到 :root 默认。
 */
let styleEl: HTMLStyleElement | null = null;
export function applyThemeTokens(tokens?: Record<string, string>): void {
  if (typeof document === 'undefined') return;
  if (!styleEl) {
    styleEl =
      (document.getElementById('lc-theme-tokens') as HTMLStyleElement | null) ??
      Object.assign(document.createElement('style'), { id: 'lc-theme-tokens' });
    if (!styleEl.parentNode) document.head.appendChild(styleEl);
  }
  const body = tokens
    ? Object.entries(tokens)
        .map(([k, v]) => `${k}:${v};`)
        .join('')
    : '';
  styleEl.textContent = body ? `:root{${body}}` : '';
}
