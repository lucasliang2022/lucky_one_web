/**
 * 主题命名约定:`<结构>-<皮肤>`
 *   结构 layout:ud(上下结构) | lr(左右结构)
 *   皮肤 skin:  default | star | ...(可继续扩)
 * 例:ud-default(当前默认)、lr-default、ud-star、lr-star。
 *
 * 结构决定「布局外壳」(组件树/区域摆放),皮肤决定「设计变量」(颜色/背景/圆角…)。
 * 二者正交:同一皮肤可套在不同结构上,反之亦然。
 */
export type LayoutKey = 'ud' | 'lr';

export interface ResolvedTheme {
  raw: string;       // 归一化后的完整名,如 'lr-default'
  layout: LayoutKey; // 结构
  skin: string;      // 皮肤
}

const LAYOUTS: readonly LayoutKey[] = ['ud', 'lr'];
export const DEFAULT_THEME = 'ud-default';

/** 本地覆盖 key:便于不改后端就预览(见 captureThemeOverride) */
const OVERRIDE_KEY = 'lc_theme';

/**
 * 把 config 下发的主题名解析成 { layout, skin }。
 * 非法/缺省一律回退到 ud-default,保证永远有可用结构。
 */
export function resolveTheme(name?: string | null): ResolvedTheme {
  let override = '';
  try { override = localStorage.getItem(OVERRIDE_KEY) || ''; } catch { /* ignore */ }

  const raw = (override || name || DEFAULT_THEME).trim().toLowerCase();
  const [layoutRaw, ...rest] = raw.split('-');
  const layout: LayoutKey = (LAYOUTS as readonly string[]).includes(layoutRaw)
    ? (layoutRaw as LayoutKey)
    : 'ud';
  const skin = rest.join('-') || 'default';
  return { raw: `${layout}-${skin}`, layout, skin };
}

/**
 * 预览用:URL 带 ?theme=lr-default 时写进 localStorage,之后一直生效;
 * ?theme=reset 清除覆盖,回到后端下发的主题。
 */
export function captureThemeOverride(): void {
  try {
    const q = new URLSearchParams(window.location.search).get('theme');
    if (!q) return;
    if (q === 'reset') localStorage.removeItem(OVERRIDE_KEY);
    else localStorage.setItem(OVERRIDE_KEY, q);
  } catch { /* ignore */ }
}
