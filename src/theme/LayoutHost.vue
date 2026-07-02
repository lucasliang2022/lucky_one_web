<template>
  <!-- 按当前主题的「结构」渲染对应布局外壳(懒加载,不把所有皮肤打进一个包) -->
  <component :is="shell" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useCommonStore } from '@/stores/commonStore';
import { resolveTheme, type LayoutKey } from '@/theme/resolveTheme';

// 结构注册表:结构 key -> 外壳组件。新增结构在此登记即可。
const SHELLS: Record<LayoutKey, ReturnType<typeof defineAsyncComponent>> = {
  ud: defineAsyncComponent(() => import('@/theme/shells/UdShell.vue')),
  lr: defineAsyncComponent(() => import('@/theme/shells/LrShell.vue')),
};

const commonStore = useCommonStore();
const shell = computed(() => SHELLS[resolveTheme(commonStore.partner?.theme).layout] ?? SHELLS.ud);
</script>
