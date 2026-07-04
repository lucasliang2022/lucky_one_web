<template>
  <div class="loading-wrapper">
    <el-icon class="loading-icon"><Loading /></el-icon>
    <p>加载中...</p>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue';
</script>

<style scoped>
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #888;
}

.loading-icon {
  font-size: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
