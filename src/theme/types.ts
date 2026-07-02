import type { Component } from 'vue';

/** 可被主题单独定制的功能模块 */
export type RegionKey =
  | 'topNav'          // 顶部导航条
  | 'logo'            // logo 部位
  | 'menu'            // 菜单导航
  | 'gameLottery'     // 游戏与彩票摆放(内容级)
  | 'floatingButtons' // 右侧悬浮按钮
  | 'footer';         // 尾部

export type RegionLoader = () => Promise<{ default: Component } | Component>;

/**
 * 一套主题的清单(放在 src/theme/themes/<主题名>/index.ts,自动被发现)。
 * 主题名约定 `<结构>-<皮肤>`:结构(ud/lr)由名字前缀决定 → 复用对应外壳,无需在此声明。
 */
export interface ThemeManifest {
  /** 覆盖的区块组件(只写与 base 不同的;其余自动回退 base) */
  regions?: Partial<Record<RegionKey, RegionLoader>>;
  /** 皮肤:CSS 变量覆盖(语义 token),运行时注入 :root */
  tokens?: Record<string, string>;
}
