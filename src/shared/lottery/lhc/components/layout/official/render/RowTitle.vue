<template>
  <div v-if="title" :class="$style.rowTitle">
    <span>{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import styles from '@/assets/scss/lottery/lottery.module.scss';
const $style = styles;

defineProps({
  title: {
    type: String,
    default: ''
  }
});
</script>