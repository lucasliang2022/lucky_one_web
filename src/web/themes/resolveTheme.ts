/**
 * 主题标识:单一 sign(如 'default' / 'moon' / 'star')。
 *   frame / page / css 三处各自拿同一个 sign 去查,查不到各自回退 'default'。
 *   sign 由商户 config 下发的 tenant.theme 决定,缺省 'default'。
 */
export const DEFAULT_SIGN = 'default';

/** 本地覆盖 key:便于不改后端就预览(见 captureThemeOverride)。 */
const OVERRIDE_KEY = 'lc_theme';

/** 归一化 sign:本地覆盖 > 后端下发 > default。 */
export function resolveSign(name?: string | null): string {
  let override = '';
  try { override = localStorage.getItem(OVERRIDE_KEY) || ''; } catch { /* ignore */ }
  const sign = (override || name || DEFAULT_SIGN).trim().toLowerCase();
  return sign || DEFAULT_SIGN;
}

/**
 * 预览用:URL 带 ?theme=moon 时写进 localStorage,之后一直生效;
 * ?theme=reset 清除覆盖,回到后端下发的 sign。
 */
export function captureThemeOverride(): void {
  try {
    const q = new URLSearchParams(window.location.search).get('theme');
    if (!q) return;
    if (q === 'reset') localStorage.removeItem(OVERRIDE_KEY);
    else localStorage.setItem(OVERRIDE_KEY, q);
  } catch { /* ignore */ }
}
