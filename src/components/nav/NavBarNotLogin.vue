<template>
  <ul class="nav-bar-right not-login">
    <li class="nav-bar-item">
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
      <a href="/login">{{ t('components.nav.login') }}</a>
    </li>
    <li class="nav-bar-item">
      <a href="/register">{{ t('components.nav.register') }}</a>
    </li>
    <li class="nav-bar-item">
      <a href="/free-play">{{ t('components.nav.freePlay') }}</a>
    </li>
  </ul>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import NavLang from "@/components/nav/NavLang.vue";

const { t } = useI18n();
</script>

<style lang="scss" scoped>
.nav-bar-right {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.not-login {
  li {
    display: flex;
    align-items: center;
  }
  a {
    padding: 0 6px;
    color: #666;
  }
  a:hover {
    color: #e4393c !important;
    text-decoration: underline;
  }
  li:first-child a,
  li:first-child div {
    border-left: none;
  }
}
.sd-icon {
  margin-right: 5px;
  font-size: 16px;
  color: #326BC7;
}
</style>
