<template>
  <div class="nav-bar-right not-login">
    <NavLang />
    <NavTimezone />
    <a class="nav-link" href="/line-test">{{ t('components.nav.lineTest') }}</a>
    <router-link class="nav-link" to="/login">{{ t('components.nav.login') }}</router-link>
    <router-link
        v-if="commonStore.featureFlags?.enable_register !== false"
        class="nav-link"
        to="/register"
    >
      {{ t('components.nav.register') }}
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@/stores/commonStore';
import NavLang from '@/components/nav/NavLang.vue';
import NavTimezone from '@/components/nav/NavTimezone.vue';

const { t } = useI18n();
const commonStore = useCommonStore();
</script>

<style lang="scss" scoped>
.nav-bar-right {
  display: flex;
  align-items: center;
  height: 30px;
  gap: 0;
}

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
  pointer-events: none;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  height: 30px;
  color: #666;
  text-decoration: none;
  white-space: nowrap;
  font-size: 13px;
  min-width: 56px;

  &:hover {
    color: #e4393c;
    text-decoration: underline;
  }
}
</style>