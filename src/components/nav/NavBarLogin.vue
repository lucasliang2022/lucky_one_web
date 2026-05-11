<template>
  <div class="nav-bar-right is-login">
    <NavLang />
    <NavTimezone />
    <a class="nav-link" href="/line-test">{{ t('components.nav.lineTest') }}</a>
    <NavBalance />
    <div class="user-menu">
      <el-menu
          :default-active="'0'"
          popper-class="el-menu-user"
          mode="horizontal"
          :ellipsis="false"
          :hide-timeout="500"
      >
        <el-sub-menu index="0">
          <template #title>
            <span class="username-wrapper">{{ t('components.nav.welcome') }}，</span>{{ userStore.username }}
          </template>
          <el-menu-item index="0-1" @click="navToAccount('overview')">
            <span class="sd-icon icon-sd-menu"></span>{{ t('components.nav.myAccount') }}
          </el-menu-item>
          <el-menu-item index="0-2">
            <span class="sd-icon icon-sd-recharge"></span>{{ t('components.nav.recharge') }}
          </el-menu-item>
          <el-menu-item index="0-3">
            <span class="sd-icon icon-sd-withdraw"></span>{{ t('components.nav.withdraw') }}
          </el-menu-item>
          <el-menu-item index="0-4">
            <span class="sd-icon icon-sd-loop2"></span>{{ t('components.nav.balanceTransfer') }}
          </el-menu-item>
          <el-menu-item index="0-5" @click="navToAccount('orderList')">
            <span class="sd-icon icon-sd-mail"></span>{{ t('components.nav.gameRecords') }}
          </el-menu-item>
          <el-menu-item index="0-9" @click="userStore.logout()">
            <span class="sd-icon icon-sd-exit"></span>{{ t('components.nav.logout') }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore';
import NavLang from '@/components/nav/NavLang.vue';
import NavBalance from '@/components/nav/NavBalance.vue';
import NavTimezone from '@/components/nav/NavTimezone.vue';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const navToAccount = (page: string) => {
  router.push({ name: 'account', params: { page } });
};
</script>

<style lang="scss" scoped>
.nav-bar-right {
  display: flex;
  align-items: center;
  height: 30px;
  gap: 0;
}

/* ★ 关键：非首项前面用 ::before 画分隔符
   组件 v-if 整体不渲染时不在 DOM 里，::before 选不到，分隔符自动消失 */
.nav-bar-right > * + * {
  position: relative;
  margin-left: 24px;
}
.nav-bar-right > * + *::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 14px;
  background-color: #e0e0e0;
  pointer-events: none;       /* 防止鼠标移到分隔符上触发下拉 */
}

.nav-link {
  display: inline-flex;
  align-items: center;
  height: 30px;
  color: #666;
  text-decoration: none;
  white-space: nowrap;
  font-size: 13px;

  &:hover {
    color: #e4393c;
    text-decoration: underline;
  }
}

.user-menu {
  display: inline-flex;
  align-items: center;
  height: 30px;
}

.sd-icon { margin-right: 5px; font-size: 16px; color: #326BC7; }

/* el-menu 默认样式覆盖 */
:deep(.el-menu--horizontal) {
  border-bottom: none;
  background: transparent;
  --el-menu-bg-color: transparent;
  --el-menu-hover-bg-color: transparent;
}

:deep(.el-sub-menu__title) {
  line-height: 30px !important;
  height: 30px !important;
  padding: 0 5px !important;
  border-bottom: none !important;
  font-size: 13px;
  color: #666 !important;

  &:hover { color: #e4393c !important; }
}

.el-menu-user .el-menu {
  z-index: 99999;
  min-width: 160px !important;
}
</style>