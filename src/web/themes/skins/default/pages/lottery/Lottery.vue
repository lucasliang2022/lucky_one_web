<template>
  <div class="lottery-page">
    <component
        :is="catComponent"
        :sign="sign"
        :category="category"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue';
import ComingSoon from '@web/themes/skins/default/pages/lottery/ComingSoon.vue';

const props = defineProps<{
  category: string;
  sign: string;
}>();


const categoryMap: Record<string, () => Promise<Component>> = {
  ssc:   () => import('@web/themes/skins/default/pages/lottery/Ssc.vue'),
  sd:    () => import('@web/themes/skins/default/pages/lottery/Sd.vue'),
  ks:    () => import('@web/themes/skins/default/pages/lottery/Ks.vue'),
  lhc:   () => import('@web/themes/skins/default/pages/lottery/Lhc.vue'),
  pk10:  () => import('@web/themes/skins/default/pages/lottery/Pk10.vue'),
  kl28:  () => import('@web/themes/skins/default/pages/lottery/Kl8.vue'),
};

const catComponent = computed<Component>(() => {
  const loader = categoryMap[props.category];
  if (!loader) return ComingSoon;
  return defineAsyncComponent({
    loader,
    errorComponent: ComingSoon,
  });
});
</script>

<style lang="scss" scoped>
.lottery-page {
  width: 100%;
  height: 100%;
}
</style>