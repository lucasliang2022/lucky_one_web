import type { ThemeManifest } from '@/theme/types';

/**
 * lr-moon —— 左右结构 + 「月夜」深色皮肤。
 *   · 结构 lr:名字前缀 `lr-` 自动复用 LrShell,布局零代码。
 *   · 皮肤 moon:下方 tokens 覆盖语义 CSS 变量,运行时注入 :root。
 *   · 若某模块结构也要不同,再加 regions(见注释),没写的自动用 base。
 * 这就是新增一套主题的全部:一个文件夹 + 一个 index.ts,无需改任何核心文件。
 */
const theme: ThemeManifest = {
  tokens: {
    '--sd-color-bg-top': '#0e1030',
    '--sd-color-bg-main': '#0b0c22',
    '--sd-color-bg-secondary': '#171a3a',
    '--sd-color-bg-cover': '#171a3a',
    '--sd-color-txt-main': '#e8ecff',
    '--sd-color-txt-primary': '#e8ecff',
    '--sd-color-txt-secondary': '#aab3e0',
    '--sd-color-txt-tertiary': '#7f88bf',
    '--color-primary': '#7c83ff',
    '--color-background': '#0b0c22',
    '--color-gray-4': '#0b0c22',
    '--color-border': '#2a2f5a',
  },

  // 需要某模块结构也不同时才写(例:月夜专属顶栏 / 侧边菜单):
  // regions: {
  //   topNav: () => import('./TopNav.vue'),
  //   menu:   () => import('./SideMenu.vue'),
  // },
};

export default theme;
