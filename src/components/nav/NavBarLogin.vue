<template>
  <ul class="nav-bar-right is-login">
    <li>
      <NavLang />
    </li>
    <li>
      <el-divider direction="vertical" />
    </li>
    <li class="nav-bar-item">
      <a href="/line-test" class="router-link-exact-active curr">{{ t('components.nav.lineTest') }}</a>
    </li>
    <li>
      <el-divider direction="vertical" />
    </li>
    <li class="nav-bar-item">
      <a href="/member-benefits">{{ t('components.nav.memberBenefits') }}</a>
    </li>
    <li>
      <el-divider direction="vertical" />
    </li>
    <li class="nav-bar-item">
      <a href="/agent-join">{{ t('components.nav.agentJoin') }}</a>
    </li>
    <li>
      <el-divider direction="vertical" />
    </li>
    <li class="nav-bar-item">
      <el-tooltip class="box-item" effect="light" popper-class="balance-dropdown" placement="top">
        <span class="balance-wrapper">
          {{ t('components.nav.rmbBalance') }}：<span class="balance">¥{{ balanceRmb }}</span>
          <span class="fresh-icon flex items-center" @click="userStore.fetchBalance()">
            <span class="sd-icon icon-sd-fresh" style="font-size: 14px; color: #488ded;"></span>
          </span>
        </span>
        <template #content>
          <div class="balance-content">
            <div class="b-content-top">
              <div class="top-title flex items-center">
                <span class="sd-icon icon-sd-wallet" style="font-size: 14px"></span>{{ t('components.nav.platformBalance') }}
              </div>
              <div class="top-detail">
                <div class="flex items-center top-title-item">
                  <div class="dot"></div>
                  <div class="lottery-b-title">{{ t('components.nav.rmbBalance') }}</div>
                  <div class="lottery-b-value ml-auto">¥{{ balanceRmb }}</div>
                  <el-button size="small" link type="primary" class="flex items-center">{{ t('components.nav.recharge') }}</el-button>
                </div>
                <div class="flex items-center top-title-item">
                  <div class="dot"></div>
                  <div class="lottery-b-title">{{ t('components.nav.usdtBalance') }}</div>
                  <div class="lottery-b-value ml-auto">¥{{ balanceUsdt }}</div>
                  <el-button size="small" link type="primary" class="flex items-center">{{ t('components.nav.recharge') }}</el-button>
                </div>
              </div>
            </div>
            <div style="margin: 5px 12px;">
              <el-divider border-style="dashed" style="margin: 10px 0" />
            </div>
            <div class="b-content-bottom">
              <el-menu default-active="" class="balance-third-game" :unique-opened="true">
                <el-sub-menu v-for="(group, key) in balanceThird" :key="key" :index="key">
                  <template #title>
                    <span class="sd-icon" :class="group.icon" style="font-size: 14px; color: #488ded;"></span>
                    <span>{{ group.label }}</span>
                  </template>
                  <el-menu-item v-for="(item, index) in group.items" :key="index" :index="`${key}-${index}`">
                    <div class="flex items-center justify-between width-100">
                      <div>{{ item.name }}</div>
                      <div>¥{{ item.balance }}</div>
                    </div>
                  </el-menu-item>
                </el-sub-menu>
              </el-menu>
            </div>
            <div class="b-content-button justify-center flex items-center" style="margin: 10px 12px;">
              <el-button type="primary" style="padding: 0 35px;">{{ t('components.nav.balanceTransfer') }}</el-button>
            </div>
          </div>
        </template>
      </el-tooltip>
    </li>
    <li>
      <el-divider direction="vertical" />
    </li>
    <li class="nav-bar-item">
      <el-menu
          :default-active="'0'"
          popper-class="el-menu-user"
          mode="horizontal"
          :ellipsis="false"
          :hide-timeout="500"
          class="flex items-center"
      >
        <el-sub-menu index="0">
          <template #title><span class="username-wrapper">{{ t('components.nav.welcome') }}，</span>{{ userName }}</template>
          <el-menu-item class="item" index="0-1">
            <span class="sd-icon icon-sd-menu"></span>{{ t('components.nav.myAccount') }}
          </el-menu-item>
          <el-menu-item-group>
            <template #title>
              <span class="sd-icon icon-sd-recharge"></span>
              <span class="sub-menu-item-title">{{ t('components.nav.recharge') }}</span>
            </template>
            <el-menu-item index="0-2">{{ t('components.nav.rmbRecharge') }}</el-menu-item>
            <el-menu-item index="0-3">{{ t('components.nav.usdtRecharge') }}</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template #title>
              <span class="sd-icon icon-sd-withdraw"></span>
              <span class="sub-menu-item-title">{{ t('components.nav.withdraw') }}</span>
            </template>
            <el-menu-item index="0-4">{{ t('components.nav.rmbWithdraw') }}</el-menu-item>
            <el-menu-item index="0-5">{{ t('components.nav.usdtWithdraw') }}</el-menu-item>
          </el-menu-item-group>
          <el-menu-item index="0-6">
            <span class="sd-icon icon-sd-loop2"></span>{{ t('components.nav.balanceTransfer') }}
          </el-menu-item>
          <el-menu-item index="0-7">
            <span class="sd-icon icon-sd-mail"></span>{{ t('components.nav.messages') }}
          </el-menu-item>
          <el-menu-item index="0-8" @click="navToAccount('orderList')">
            <span class="sd-icon icon-sd-mail"></span>{{ t('components.nav.gameRecords') }}
          </el-menu-item>
          <el-menu-item index="0-9" @click="handleLogout">
            <span class="sd-icon icon-sd-exit"></span>{{ t('components.nav.logout') }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore.ts';
import { useCommonStore } from '@/stores/commonStore.js';
import { useI18n } from 'vue-i18n';
import NavLang from "@/components/nav/NavLang.vue";

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const commonStore = useCommonStore();

const userName = computed(() => userStore.user ? userStore.user.username : '');
const balanceRmb = computed(() => userStore.balance?.main?.rmb || '0.00');
const balanceUsdt = computed(() => userStore.balance?.main?.usdt || '0.00');

const balanceThird = computed(() => ({
  '1': { label: '棋牌游戏', icon: 'icon-sd-chess', items: userStore.balance.third.chess || '0.00' },
  '2': { label: '体育赛事', icon: 'icon-sd-sport', items: userStore.balance.third.sport || '0.00' },
  '3': { label: '真人视讯', icon: 'icon-sd-live', items: userStore.balance.third.live || '0.00' },
  '4': { label: '电子游艺', icon: 'icon-sd-elec', items: userStore.balance.third.elec || '0.00' },
  '5': { label: '捕鱼游戏', icon: 'icon-sd-fish', items: userStore.balance.third.fish || '0.00' },
}));

const handleLogout = () => {
  userStore.logout();
};

const navToAccount = (page) => {
  router.push({ name: 'account', params: { page } });
};
</script>

<style lang="scss" scoped>
.nav-bar-item {
  .el-menu {
    margin-bottom: 0;
    line-height: 30px;
    height: 30px;
    border-bottom: none;
    background-color: var(--sd-color-bg-top);
  }
  .el-sub-menu__title:hover {
    background-color: var(--sd-color-bg-cover) !important;
  }
}
.language-switcher {
  line-height: 20px;
  cursor: pointer;
}
.balance-dropdown {
  width: 250px;
  background-color: var(--sd-color-bg-top) !important;
  font-size: .75rem;
  line-height: 1rem;
  padding: 0;
}

.balance-content {
  color: var(--color-primary-1) !important;
  font-size: .75rem;
  line-height: 1rem;
}

.b-content-top {
  padding: 5px 15px;
  color: var(--color-txt-secondary);
}

.top-title {
  padding: 0.375rem 0;
}

.top-detail .top-title-item {
  height: 22px;
}

.dot {
  margin-right: 5px;
  height: .25rem;
  width: .25rem;
  border-radius: .125rem;
  background-color: var(--color-primary-lighten-2);
}

.balance-third-game {
  border-right: none !important;
}

.balance-third-game .el-sub-menu .el-sub-menu__title {
  height: 35px;
  line-height: 35px;
}

.balance-third-game .el-menu-item {
  background-color: var(--color-gray-5);
  height: 30px;
  line-height: 30px;
  margin: 2.5px 15px;
  padding: 0 .625rem;
  border-radius: .25rem;
  font-size: 12px;
}

.el-menu-user .el-menu {
  z-index: 99999;
  min-width: 160px !important;
}

.el-menu-user .el-menu-item-group {
  padding-left: 25px !important;
}

.el-menu-user .el-menu-item {
  padding-left: 25px !important;
}

.nav-bar-right {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.is-login {
  li {
    display: inline-block;
    padding-left: 5px;
    cursor: pointer;
  }
}

.nav-bar-item {
  display: flex;
  align-items: center;
}

:deep(.el-sub-menu__title) {
  line-height: 20px;
  padding: 0 5px;
}

.balance-wrapper {
  color: var(--color-primary-1);
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.fresh-icon {
  margin-top: 2px;
  margin-left: 2px;
}

a {
  color: #666;
}

a:hover {
  color: #e4393c !important;
  text-decoration: underline;
}

.sd-icon {
  margin-right: 5px;
  font-size: 16px;
  color: #326BC7;
}
</style>