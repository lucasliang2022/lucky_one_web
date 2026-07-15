<template>
  <div class="account-container">
    <div class="account-inner-container">
      <div class="account-sidebar">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><span class="icon-sd icon-sd-menu"></span></el-icon>
              <span>账号总览</span>
            </template>
            <el-menu-item index="1-1">个人资料</el-menu-item>
            <el-menu-item index="1-2" @click="goto('security')">安全中心</el-menu-item>
            <el-menu-item index="1-3">银行账户</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><span class="icon-sd icon-sd-my_02"></span></el-icon>
              <span>账号设置</span>
            </template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="3">
            <el-icon><span class="icon-sd icon-sd-setting"></span></el-icon>
            <span>积分记录</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><span class="icon-sd icon-sd-setting"></span></el-icon>
            <span>我的关注</span>
          </el-menu-item>
          <el-menu-item index="5">
            <el-icon><span class="icon-sd icon-sd-card"></span></el-icon>
            <span>充值</span>
          </el-menu-item>
          <el-sub-menu index="6">
            <template #title>
              <el-icon><span class="icon-sd icon-sd-data_02"></span></el-icon>
              <span>游戏记录</span>
            </template>
            <el-menu-item index="6-1">投注记录</el-menu-item>
            <el-menu-item index="6-2">追号记录</el-menu-item>
            <el-menu-item index="6-3">个人报表</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="7" @click="goto('message')">
            <el-icon><span class="icon-sd icon-sd-mail"></span></el-icon>
            <span>站内消息</span>
          </el-menu-item>
          <el-menu-item index="8">
            <el-icon><span class="icon-sd icon-sd-notice_02"></span></el-icon>
            <span>系统公告</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="account-main">
        <Message v-if="page === 'message'" />
        <Security v-else-if="page === 'security'" />
        <OrderList v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OrderList from "@web/themes/skins/default/pages/account/OrderList.vue";
import Message from "@web/themes/skins/default/pages/account/Message.vue";
import Security from "@web/themes/skins/default/pages/account/Security.vue";

const route = useRoute();
const router = useRouter();
const page = computed(() => route.params.page);
// 选中态跟随路由
const activeIndex = computed(() => {
  if (page.value === 'message') return '7';
  if (page.value === 'security') return '1-2';
  return '2';
});
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
