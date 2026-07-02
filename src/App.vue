<template>
  <el-config-provider :locale="elLocale">
    <div id="app">
      <!-- 布局由商户主题决定:ud(上下)/lr(左右);皮肤走 data-skin -->
      <LayoutHost />
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { ElConfigProvider } from 'element-plus';
import LayoutHost from '@/theme/LayoutHost.vue';
import { resolveTheme, captureThemeOverride } from '@/theme/resolveTheme';
import { THEMES, applyThemeTokens } from '@/theme/registry';
import { useCommonStore } from '@/stores/commonStore';
import { useUserStore } from '@/stores/userStore';

// 预览用:URL ?theme=lr-default 覆盖(写 localStorage);?theme=reset 清除
captureThemeOverride();

// Element Plus 各语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import zhTw from 'element-plus/es/locale/lang/zh-tw';
import en from 'element-plus/es/locale/lang/en';
import th from 'element-plus/es/locale/lang/th';
import vi from 'element-plus/es/locale/lang/vi';
import id from 'element-plus/es/locale/lang/id';
import pt from 'element-plus/es/locale/lang/pt';

const ELEMENT_LOCALE_MAP: Record<string, any> = {
  'zh-CN': zhCn,
  'zh-TW': zhTw,
  'en':    en,
  'th':    th,
  'vi':    vi,
  'id':    id,
  'pt':    pt,
  'hi':    en,    // element-plus 没 hi，用 en 兜底
  'fil':   en,    // 同上
};

const commonStore = useCommonStore();
const userStore = useUserStore();

const elLocale = computed(() => ELEMENT_LOCALE_MAP[userStore.currentLanguage] ?? en);

// 当前主题(随 config 下发的 partner.theme 变化)。把 结构/皮肤 挂到根元素,
// CSS 用 [data-layout="lr"] / [data-skin="star"] 做差异化,组件本身对主题无感知。
const theme = computed(() => resolveTheme(commonStore.partner?.theme));
watch(theme, (t) => {
  document.documentElement.dataset.layout = t.layout;
  document.documentElement.dataset.skin = t.skin;
  // 注入该主题的皮肤 token(来自 themes/<name>/index.ts;无则回退 :root 默认)
  applyThemeTokens(THEMES[t.raw]?.tokens);
}, { immediate: true });

onMounted(async () => {
  // 1. 拉 partner 配置（必须先于所有偏好初始化）
  if (!commonStore.isLoaded) {
    try { await commonStore.initMainConfig(); } catch (e) { console.error('initMainConfig failed', e); }
  }

  // 2. 探测浏览器偏好（首次访问时填 anon*，已有值则保留）
  await userStore.initAnonPreferences();

  // 3. 如果已登录，拉用户详情
  if (userStore.token && !userStore.isUserLoaded) {
    try { await userStore.initUserInfo(); } catch (e) { console.error('initUserInfo failed', e); }
  }

  // 4. 余额
  if (userStore.token && !userStore.isBalanceLoaded) {
    try { await userStore.fetchBalance(); } catch (e) { console.error('fetchBalance failed', e); }
  }

  // 5. 回到页面时同步总后台最新配置（data_version 变了才应用）
  document.addEventListener('visibilitychange', onVisible);
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisible);
});

// 切回本页签时：拉一次配置，若总后台改过(data_version 变化)则应用并重新收敛本地偏好，
// 这样用户端不整页刷新也能同步最新支持的语言/币种/国家。
async function onVisible(): Promise<void> {
  if (document.visibilityState !== 'visible' || !commonStore.isLoaded) return;
  try {
    const changed = await commonStore.refreshConfig();
    if (changed) await userStore.initAnonPreferences();
  } catch (e) {
    console.error('refreshConfig failed', e);
  }
}
</script>

<style lang="scss">
body {
  overflow-x: hidden;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
  min-height: 100vh;
  /* 具体上下/左右布局由主题外壳(UdShell/LrShell)自身决定 */
}
</style>