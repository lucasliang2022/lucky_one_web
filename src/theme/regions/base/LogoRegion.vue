<template>
  <!-- logo 部位:base = 商户 config 下发的 logo(点击回首页) -->
  <div class="logo-region" @click="goHome">
    <img v-if="logo" :src="logo" alt="logo" class="logo-region__img" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@/stores/commonStore';

const commonStore = useCommonStore();
const router = useRouter();
const logo = computed(() => commonStore.partner?.logo);
const goHome = () => router.push('/');
</script>

<style lang="scss" scoped>
.logo-region {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  &__img { height: 32px; object-fit: contain; display: block; }
}
</style>
