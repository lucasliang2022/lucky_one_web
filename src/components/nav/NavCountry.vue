<template>
  <el-dropdown v-if="hasMultiple" class="nav-switcher" trigger="hover" @command="handleSwitch">
    <span class="switcher-trigger">
      <span class="flag-emoji">{{ currentFlag }}</span>
      <span class="switcher-label">{{ currentLabel }}</span>
      <span class="el-icon-arrow-down"></span>
    </span>
    <template #dropdown>
      <el-dropdown-menu class="country-menu">
        <el-dropdown-item
            v-for="opt in commonStore.countries"
            :key="opt.code"
            :command="opt.code"
            :class="{ 'is-active': opt.code === userStore.currentCountry }"
        >
          <span class="flag-emoji">{{ opt.flag }}</span>
          <span class="country-label">{{ opt.label }}</span>
          <span class="dial-code">{{ opt.dial_code }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useCommonStore } from '@/stores/commonStore';
import { useUserStore } from '@/stores/userStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const commonStore = useCommonStore();
const userStore = useUserStore();

const currentCountryOpt = computed(() =>
    commonStore.countries.find(c => c.code === userStore.currentCountry),
);
const currentFlag  = computed(() => currentCountryOpt.value?.flag ?? '🌐');
const currentLabel = computed(() => currentCountryOpt.value?.label ?? userStore.currentCountry);

const handleSwitch = async (country: string) => {
  if (country === userStore.currentCountry) return;
  try {
    await userStore.switchCountry(country);
  } catch (e: any) {
    ElMessage.error(e?.message ?? t('components.nav.switchFailed'));
  }
};

const hasMultiple = computed(() => commonStore.countries.length >= 2);

</script>

<style lang="scss" scoped>
.nav-switcher { line-height: 20px; cursor: pointer; }
.switcher-trigger { display: inline-flex; align-items: center; gap: 4px; color: #666; }
.switcher-trigger:hover { color: #e4393c; }
.switcher-label { padding: 0 2px; }
.flag-emoji { font-size: 14px; line-height: 1; }
.country-menu { max-height: 360px; overflow-y: auto; min-width: 220px; }
.country-label { margin-left: 8px; }
.dial-code { margin-left: 8px; color: #999; font-family: monospace; font-size: 12px; }
.is-active { color: #326BC7; font-weight: 600; }
</style>