<template>
  <!-- 按当前 sign 渲染对应「骨架 frame」(懒加载);沿 default 兜底。frame 内含 <router-view>。 -->
  <component :is="frame" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCommonStore } from '@shared/stores/commonStore';
import { resolveSign } from '@h5/themes/resolveTheme';
import { frameOf } from '@h5/themes/resolve';

const commonStore = useCommonStore();
const frame = computed(() => frameOf(resolveSign(commonStore.tenant?.theme)));
</script>
