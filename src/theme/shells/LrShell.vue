<template>
  <!-- 左右结构(lr):顶栏 + (左侧菜单 / 右侧内容) + 尾部。各模块同样用 <Region> 占位。 -->
  <div class="lr-shell">
    <Region name="topNav" />
    <div class="lr-body">
      <aside class="lr-sidebar">
        <Region name="logo" />
        <Region name="menu" />
      </aside>
      <main class="lr-content">
        <router-view />
        <Region name="floatingButtons" />
      </main>
    </div>
    <Region name="footer" />
  </div>
</template>

<script setup lang="ts">
import Region from '@/theme/Region.vue';
</script>

<style lang="scss" scoped>
.lr-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.lr-body {
  flex: 1;
  display: flex;
  align-items: stretch;
}

.lr-sidebar {
  flex: 0 0 220px;
  width: 220px;
  background: var(--sd-color-bg-secondary, #fff);
  border-right: 1px solid var(--color-border, #eee);
}

.lr-content {
  flex: 1;
  min-width: 0;
  background-color: var(--color-gray-4, #f5f5f5);
}
</style>
