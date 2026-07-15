<template>
  <div v-if="title" :class="$style.rowTitle">
    <span>{{ t(title) }}</span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import styles from '@/assets/scss/lottery/lottery.module.scss';
const $style = styles;
const { t } = useI18n();

defineProps({
  title: {
    type: String,
    default: ''
  }
});
</script>