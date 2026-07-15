<template>
  <!-- 占位:按当前主题渲染该区块对应组件;透传 props + 所有具名 slot,便于外壳/页面传参 -->
  <component :is="comp" v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCommonStore } from '@shared/stores/commonStore';
import { resolveSign } from '@h5/themes/resolveTheme';
import { regionOf } from '@h5/themes/resolve';
import type { RegionKey } from '@h5/themes/types';

defineOptions({ inheritAttrs: false });
const props = defineProps<{ name: RegionKey }>();
const commonStore = useCommonStore();
const comp = computed(() => regionOf(props.name, resolveSign(commonStore.tenant?.theme)));
</script>
