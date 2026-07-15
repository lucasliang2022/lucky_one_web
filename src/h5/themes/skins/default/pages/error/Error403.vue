<template>
  <div class="page-h5-error">
    <van-empty image="error" description="403 - Forbidden" />
    <div class="page-h5-error__action">
      <van-button type="primary" block @click="goHome">Home</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
function goHome(): void {
  router.push('/');
}
</script>

<style lang="scss">
.page-h5-error__action {
  padding: 16px;
}
</style>
