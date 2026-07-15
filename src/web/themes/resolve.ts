import { defineAsyncComponent, type Component } from 'vue';
import { DEFAULT_SIGN } from '@web/themes/resolveTheme';
import type { RegionKey } from '@web/themes/types';

/**
 * 加载器在 themes/ 根:皮肤在 themes/skins/<sign>/(frame / pages / main.css),
 * 公共区块在 themes/regions/。
 * 解析规则:
 *   frame / page → skins/{sign}/{type}/{id}.vue,找不到回落 skins/default/{type}/{id}.vue。
 *   region       → 皮肤覆盖 skins/{sign}/regions/{key}.vue,没有则用公共 regions/{key}.vue。
 * default 皮肤既是「默认皮肤」也是 frame/page 的共享底座;region 的底座是公共 regions/。
 * CSS 见 loadCss.ts(打底 + 叠加)。
 */
const modules = import.meta.glob(['./skins/**/*.vue', './regions/**/*.vue']);

const cache = new Map<string, Component>();

function componentAt(path: string): Component {
  if (!cache.has(path)) {
    cache.set(path, defineAsyncComponent(modules[path] as () => Promise<Component>));
  }
  return cache.get(path)!;
}

/** 皮肤资源:skins/{sign}/{rel} → skins/default/{rel} 兜底(frame / page 用)。 */
function skinComponent(rel: string, sign: string): Component {
  const signed = `./skins/${sign}/${rel}`;
  const fallback = `./skins/${DEFAULT_SIGN}/${rel}`;
  const path = modules[signed] ? signed : fallback;
  if (!modules[path]) {
    throw new Error(`[theme] skin asset "${rel}" not found (no ${signed} nor ${fallback})`);
  }
  return componentAt(path);
}

/** 骨架:skins/{sign}/frame/index.vue → default 皮肤兜底。 */
export function frameOf(sign: string): Component {
  return skinComponent('frame/index.vue', sign);
}

/** 页面:skins/{sign}/pages/{name}.vue → default 皮肤兜底。 */
export function pageOf(name: string, sign: string): Component {
  return skinComponent(`pages/${name}.vue`, sign);
}

/** 区块:皮肤覆盖 skins/{sign}/regions/{key}.vue → 公共 regions/{key}.vue 兜底。 */
export function regionOf(key: RegionKey, sign: string): Component {
  const override = `./skins/${sign}/regions/${key}.vue`;
  const shared = `./regions/${key}.vue`;
  const path = modules[override] ? override : shared;
  if (!modules[path]) {
    throw new Error(`[theme] region "${key}" not found (no ${override} nor ${shared})`);
  }
  return componentAt(path);
}
