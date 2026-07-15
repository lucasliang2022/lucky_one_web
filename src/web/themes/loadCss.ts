/**
 * 皮肤 CSS(A 方案:每套主题一个 main.css,放在自己目录里)。触达「全部页面」(含内页)。
 *   · default 永远打底:下方静态 import(themes/default/main.css),随包加载、无闪烁。
 *   · sign 的 main.css 叠加在上层(cascade 覆盖,不是二选一),切换时替换 <link>。
 *   · 内页样式定制:主题在自己的 main.css 里用 [data-sign="X"] .page-lottery {...} 触达,无需改内页组件。
 */
import '@web/themes/skins/default/main.css';

// sign -> 该皮肤 css 的最终 URL(交给 <link> 管理,可缓存)
const sheets = import.meta.glob('./skins/*/main.css', { query: '?url', import: 'default' }) as
  Record<string, () => Promise<string>>;

const LINK_ID = 'lc-theme-skin';

/** 应用某 sign 的皮肤:default(或无对应文件)→ 仅打底;其它 → 叠加/替换其 main.css。 */
export async function applyThemeCss(sign: string): Promise<void> {
  if (typeof document === 'undefined') return;
  const loader = sheets[`./skins/${sign}/main.css`];
  // default 已静态打底;sign 就是 default 或该 sign 没提供皮肤文件时,清掉叠加层即可
  if (sign === 'default' || !loader) {
    document.getElementById(LINK_ID)?.remove();
    return;
  }
  const href = await loader();
  let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = Object.assign(document.createElement('link'), { id: LINK_ID, rel: 'stylesheet' });
    document.head.appendChild(link);
  }
  const abs = new URL(href, window.location.href).href;
  if (link.href !== abs) link.href = href;
}
