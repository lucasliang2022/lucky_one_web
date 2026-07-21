<template>
  <div class="account-container">
    <div class="account-inner-container">
      <div class="account-sidebar">
        <el-menu
            :default-active="activeIndex"
            :default-openeds="defaultOpeneds"
            class="el-menu-vertical-demo"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><span class="icon-sd icon-sd-menu"></span></el-icon>
              <span>{{ m('overview') }}</span>
            </template>
            <el-menu-item index="1-1">{{ m('profile') }}</el-menu-item>
            <el-menu-item index="1-2" @click="goto('security')">{{ m('security') }}</el-menu-item>
            <el-menu-item index="1-3">{{ m('bank') }}</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><span class="icon-sd icon-sd-my_02"></span></el-icon>
              <span>{{ m('settings') }}</span>
            </template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="3">
            <el-icon><span class="icon-sd icon-sd-setting"></span></el-icon>
            <span>{{ m('points') }}</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><span class="icon-sd icon-sd-setting"></span></el-icon>
            <span>{{ m('follow') }}</span>
          </el-menu-item>
          <el-menu-item index="5">
            <el-icon><span class="icon-sd icon-sd-card"></span></el-icon>
            <span>{{ m('recharge') }}</span>
          </el-menu-item>
          <el-menu-item index="9" @click="goto('vip')">
            <el-icon><span class="icon-sd icon-sd-vip8"></span></el-icon>
            <span>{{ m('vip') }}</span>
          </el-menu-item>
          <el-sub-menu index="6">
            <template #title>
              <el-icon><span class="icon-sd icon-sd-data_02"></span></el-icon>
              <span>{{ m('gameRecord') }}</span>
            </template>
            <el-menu-item index="6-1">{{ m('lotteryRecord') }}</el-menu-item>
            <el-menu-item index="6-2">{{ m('traceRecord') }}</el-menu-item>
            <el-menu-item index="6-3">{{ m('report') }}</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="7" @click="goto('message')">
            <el-icon><span class="icon-sd icon-sd-mail"></span></el-icon>
            <span>{{ m('message') }}</span>
          </el-menu-item>
          <el-menu-item index="8">
            <el-icon><span class="icon-sd icon-sd-notice_02"></span></el-icon>
            <span>{{ m('notice') }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="account-main">
        <Vip v-if="page === 'vip'" />
        <Message v-else-if="page === 'message'" />
        <Security v-else-if="page === 'security'" />
        <OrderList v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import OrderList from "@web/themes/skins/default/pages/account/OrderList.vue";
import Message from "@web/themes/skins/default/pages/account/Message.vue";
import Security from "@web/themes/skins/default/pages/account/Security.vue";
import Vip from "@web/themes/skins/default/pages/account/Vip.vue";

const { t } = useI18n();
const m = (k) => t(`pages.account.menu.${k}`);
const route = useRoute();
const router = useRouter();
const page = computed(() => route.params.page);
// 选中态跟随路由(默认页 = 彩票记录 6-1)
const activeIndex = computed(() => {
  if (page.value === 'vip') return '9';
  if (page.value === 'message') return '7';
  if (page.value === 'security') return '1-2';
  return '6-1';
});
// 展开当前选中项所在的父级子菜单(如 6-1 → 展开「游戏记录」6)
const defaultOpeneds = computed(() => (activeIndex.value.includes('-') ? [activeIndex.value.split('-')[0]] : []));
const goto = (p) => router.push({ name: 'account', params: { page: p } });
</script>

<style lang="scss" scoped>
  .account-container {
    border-radius: 10px;
    width: 100%;
    min-width: var(--width-small-container);
    max-width: var(--width-container);
    padding-left: 80px;
    padding-right: 80px;
    margin: 10px auto auto;

    .account-inner-container {
      border-radius: 10px;
      margin-bottom: 2.5rem;
      display: flex;
      min-height: 100vh;
      .account-sidebar {
        padding: 10px 0 10px 10px;
        border-radius: 10px 0 0 10px;
        width: 200px;
        flex-shrink: 0;
        --tw-bg-opacity: 1;
        background-color: rgb(255 255 255 / var(--tw-bg-opacity));
        border-right-width: 1px;
        border-style: solid;
        border-color: rgb(170 170 170 / var(--tw-border-opacity));
        --tw-border-opacity: .1;

        /* 左侧菜单:选中项做明显区分(左侧红条 + 浅红底 + 主色加粗) */
        :deep(.el-menu) { border-right: none; background: transparent; }
        :deep(.el-menu-item:hover),
        :deep(.el-sub-menu__title:hover) { background-color: #f7f7f7; }
        :deep(.el-menu-item.is-active) {
          background-color: var(--color-primary-lighten-3, #fff1f0);
          color: var(--color-primary, #e4393c);
          font-weight: 600;
          border-right: 3px solid var(--color-primary, #e4393c);
        }
      }
      .account-main {
        min-height: 820px;
        border-radius: 0 10px 10px 0;
        position: relative;
        box-sizing: border-box;
        flex: 1 1 0%;
        --tw-bg-opacity: 1;
        background-color: rgb(255 255 255 / var(--tw-bg-opacity));
      }
    }
  }
</style>
