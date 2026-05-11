<template>
  <el-dropdown v-if="hasMultiple" trigger="hover" placement="bottom-end" @command="handleSwitch">
    <span class="nav-item">
      <span class="sd-icon icon-sd-time"></span>
      <span class="label">{{ currentOffset }}</span>
      <el-icon class="arrow"><ArrowDown /></el-icon>
    </span>

    <template #dropdown>
      <el-dropdown-menu class="timezone-menu">
        <el-dropdown-item
            v-for="opt in commonStore.timezones"
            :key="opt.code"
            :command="opt.code"
            :class="{ 'is-active': opt.code === userStore.currentTimezone }"
        >
          <span class="offset">{{ opt.offset }}</span>
          <span class="tz-label">{{ opt.label }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@/stores/commonStore';
import { useUserStore } from '@/stores/userStore';

const { t } = useI18n();
const commonStore = useCommonStore();
const userStore = useUserStore();

const hasMultiple = computed(() => commonStore.timezones.length >= 2);

const currentOpt = computed(() =>
    commonStore.timezones.find(z => z.code === userStore.currentTimezone),
);
const currentOffset = computed(() => currentOpt.value?.offset ?? userStore.currentTimezone);

const handleSwitch = async (tz: string) => {
  if (tz === userStore.currentTimezone) return;
  try {
    await userStore.switchTimezone(tz);
  } catch (e: any) {
    ElMessage.error(e?.message ?? t('components.nav.switchFailed'));
  }
};
</script>

<style lang="scss" scoped>
.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  white-space: nowrap;
  cursor: pointer;
  color: #666;
  user-select: none;

  &:hover { color: #e4393c; }

  .sd-icon { font-size: 14px; color: #326BC7; }
  .label   { font-family: 'DINAlternate', monospace; font-size: 13px; }
  .arrow   { font-size: 12px; color: #999; }
}

.timezone-menu {
  max-height: 360px;
  overflow-y: auto;
  min-width: 240px;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;

  .offset {
    display: inline-block;
    min-width: 56px;
    margin-right: 8px;
    font-family: 'DINAlternate', monospace;
    color: #326BC7;
  }
  .tz-label { color: #333; }
  &.is-active { color: #326BC7; font-weight: 600; }
}
</style>