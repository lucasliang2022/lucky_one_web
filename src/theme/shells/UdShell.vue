<template>
  <!-- 上下结构(ud):顶栏(固定) + 内容 + 尾部。各模块用 <Region> 占位,主题可逐个覆盖。 -->
  <div class="ud-shell">
    <div class="app-header">
      <Region name="topNav" />
      <Region name="menu" />
    </div>
    <div class="main-content">
      <router-view />
      <Region name="floatingButtons" />
    </div>
    <Region name="footer" />
  </div>
</template>

<script setup lang="ts">
import Region from '@/theme/Region.vue';
</script>

<style lang="scss" scoped>
.ud-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 顶栏固定(沿用原 Header 的定位;Home 用 margin-top:40px 让位) */
.app-header {
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
  font-size: 12px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.main-content {
  flex: 1;
  background-color: var(--color-gray-4, #f5f5f5);
}
</style>
