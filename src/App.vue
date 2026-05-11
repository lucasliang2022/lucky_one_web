<template>
  <el-config-provider :locale="elLocale">
    <div id="app">
      <Header />
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { ElConfigProvider } from 'element-plus';
import Header from '@/components/Header.vue';
import { useCommonStore } from '@/stores/commonStore';
import { useUserStore } from '@/stores/userStore';

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
});
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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background-color: var(--color-gray-4, #f5f5f5);
}
</style>