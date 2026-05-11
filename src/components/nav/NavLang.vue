<template>
  <el-dropdown v-if="hasMultiple" trigger="hover" placement="bottom-end" @command="onSelect">
    <span class="nav-item">
      <span class="flag">{{ currentFlag }}</span>
      <span class="label">{{ currentLabel }}</span>
      <el-icon class="arrow"><ArrowDown /></el-icon>
    </span>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
            v-for="lang in commonStore.languages"
            :key="lang.code"
            :command="lang.code"
            :class="{ 'is-active': lang.code === userStore.currentLanguage }"
        >
          <span class="flag">{{ lang.flag }}</span>
          <span class="label">{{ lang.native_label }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { useCommonStore } from '@/stores/commonStore';
import { useUserStore } from '@/stores/userStore';

const commonStore = useCommonStore();
const userStore = useUserStore();

const hasMultiple = computed(() => commonStore.languages.length >= 2);

const currentLang = computed(() =>
    commonStore.languages.find(l => l.code === userStore.currentLanguage)
);

const currentFlag  = computed(() => currentLang.value?.flag ?? '🌐');
const currentLabel = computed(() => currentLang.value?.native_label ?? userStore.currentLanguage);

const onSelect = async (code: string) => {
  if (code === userStore.currentLanguage) return;
  try {
    await userStore.switchLanguage(code);
  } catch (e) {
    console.error('switch language failed', e);
  }
};
</script>

<style lang="scss" scoped>
.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  white-space: nowrap;
  cursor: pointer;
  color: #333;
  user-select: none;

  .flag  { font-size: 16px; line-height: 1; }
  .label { font-size: 13px; }
  .arrow { font-size: 12px; color: #999; }

  &:hover { color: #e4393c; }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;

  &.is-active {
    background-color: #f0f7ff;
    color: #326BC7;
  }

  .flag  { font-size: 16px; }
  .label { font-size: 13px; }
}
</style>