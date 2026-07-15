<template>
  <!-- lr 骨架(示例:sign='lr' 时启用):左右结构。顶栏 + (左菜单 / 右内容) + 尾部。 -->
  <div class="frame-lr">
    <Region name="topNav" />
    <div class="frame-lr__body">
      <aside class="frame-lr__sidebar">
        <Region name="logo" />
        <Region name="menu" />
      </aside>
      <main class="frame-lr__content">
        <router-view />
        <Region name="floatingButtons" />
      </main>
    </div>
    <Region name="footer" />
  </div>
</template>

<script setup lang="ts">
import Region from '@web/themes/Region.vue';
</script>

<style lang="scss" scoped>
.frame-lr {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__body {
    flex: 1;
    display: flex;
    align-items: stretch;
  }

  &__sidebar {
    flex: 0 0 220px;
    width: 220px;
    background: var(--sd-color-bg-secondary, #fff);
    border-right: 1px solid var(--color-border, #eee);
  }

  &__content {
    flex: 1;
    min-width: 0;
    background-color: var(--color-gray-4, #f5f5f5);
  }
}
</style>
