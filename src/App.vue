<template>
  <el-config-provider :locale="elLocale">
    <div id="app">
      <Header />
      <div class="main-content" :style="mainContentStyle">
        <router-view />
      </div>
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, shallowRef } from 'vue';
import { ElConfigProvider } from 'element-plus';
import Header from '@/components/Header.vue';
import { useCommonStore } from '@/stores/commonStore';
import { useUserStore } from '@/stores/userStore';

// Element Plus i18n
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import zhTw from 'element-plus/es/locale/lang/zh-tw';
import en from 'element-plus/es/locale/lang/en';
import th from 'element-plus/es/locale/lang/th';
import vi from 'element-plus/es/locale/lang/vi';
import hi from 'element-plus/es/locale/lang/hi';
import pt from 'element-plus/es/locale/lang/pt';
import id from 'element-plus/es/locale/lang/id';

const ELEMENT_LOCALE_MAP: Record<string, any> = {
  'zh-CN': zhCn, 'zh-TW': zhTw, 'en': en, 'th': th, 'vi': vi,
  'hi': hi, 'pt': pt, 'id': id, 'fil': en, // fil 暂用 en
};

const commonStore = useCommonStore();
const userStore = useUserStore();

const headerHeight = ref(0);
const mainContentStyle = computed(() => ({ marginTop: `${headerHeight.value}px` }));

const elLocale = computed(() => ELEMENT_LOCALE_MAP[userStore.currentLanguage] ?? en);

onMounted(async () => {
  // 1. 公共配置（partner / 多语言列表 / 多币种 / 多时区）— 最优先，里面会设 document.title 和 favicon
  if (!commonStore.isLoaded) {
    try { await commonStore.initMainConfig(); } catch (e) { console.error('initMainConfig failed', e); }
  }

  // 2. 用户信息（如果已登录）
  if (userStore.token && !userStore.isUserLoaded) {
    try { await userStore.initUserInfo(); } catch (e) { console.error('initUserInfo failed', e); }
  }

  // 3. 余额
  if (userStore.token && !userStore.isBalanceLoaded) {
    try { await userStore.fetchBalance(); } catch (e) { console.error('fetchBalance failed', e); }
  }

  // 4. header 高度
  const header = document.querySelector<HTMLElement>('.header');
  if (header) headerHeight.value = header.offsetHeight;
});
</script>

<style lang="scss">
body { overflow-x: hidden; min-height: 100vh; margin: 0; padding: 0; }
#app { font-family: 'Avenir', Helvetica, Arial, sans-serif; text-align: center; color: #2c3e50; display: flex; flex-direction: column; min-height: 100vh; }
.main-content { background-color: var(--color-gray-4); flex: 1; }
</style>