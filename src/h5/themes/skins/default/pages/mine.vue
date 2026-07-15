<template>
  <div class="page-h5-mine">
    <van-nav-bar :title="t('h5.page.mine.title')" />

    <template v-if="userStore.isLoggedIn">
      <van-cell-group inset>
        <van-cell :title="t('h5.home.username')" :value="userStore.username || '-'" />
        <van-cell :title="t('h5.home.language')" :value="userStore.currentLanguage" />
        <van-cell :title="t('h5.home.currency')" :value="userStore.currentCurrency || '-'" />
      </van-cell-group>
      <div class="page-h5-mine__actions">
        <van-button type="danger" block @click="onLogout">{{ t('h5.home.logout') }}</van-button>
      </div>
    </template>

    <van-empty v-else :description="t('h5.page.mine.notLoggedIn')">
      <van-button type="primary" @click="goLogin">{{ t('h5.home.goLogin') }}</van-button>
    </van-empty>
  </div>
</template>

<script lang="ts" setup>
// 我的:消费 @shared/stores/userStore(与 web 同一份)。
import { useRouter } from 'vue-router';
import { useUserStore } from '@shared/stores/userStore';
import { t } from '@shared/i18n';

const router = useRouter();
const userStore = useUserStore();

function goLogin(): void {
  router.push('/login');
}
function onLogout(): void {
  userStore.logout();
}
</script>

<style lang="scss">
.page-h5-mine {
  &__actions {
    padding: 16px;
  }
}
</style>
