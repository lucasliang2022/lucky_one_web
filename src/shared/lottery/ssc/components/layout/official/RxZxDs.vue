<template>

  <ManualInputLayout :store="store" ref="manualInputLayoutRef" />
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import type { LotteryStore } from '@lottery/base/stores/storeTypes';
import {ref} from 'vue';
import ManualInputLayout from './render/InputRender.vue';

const props = defineProps({
  store: {
    type: Object as PropType<LotteryStore>,
    required: true
  }
});

const manualInputLayoutRef = ref<InstanceType<typeof ManualInputLayout> | null>(null);
</script>