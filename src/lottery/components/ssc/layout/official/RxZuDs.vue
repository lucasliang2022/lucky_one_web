<template>
  <ManualInputLayout :store="store" ref="manualInputLayoutRef" />
</template>
<script setup lang="ts">
import {ref} from 'vue';
import ManualInputLayout from './render/InputRender.vue';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const manualInputLayoutRef = ref<InstanceType<typeof ManualInputLayout> | null>(null);
</script>