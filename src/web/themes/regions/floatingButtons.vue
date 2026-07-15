<template>
  <!-- 右侧悬浮按钮:base = 现有 FloatingActions(config 就绪后再显示) -->
  <FloatingActions v-if="commonStore.isLoaded" />
</template>

<script setup lang="ts">
import FloatingActions from '@web/common/floating/FloatingActions.vue';
import { useCommonStore } from '@shared/stores/commonStore';

const commonStore = useCommonStore();
</script>
