<template>
  <!-- default 骨架:上下结构(ud)。顶栏(固定) + 内容 + 尾部,各模块用 <Region> 占位。 -->
  <div class="frame-ud">
    <div class="frame-ud__header">
      <Region name="topNav" />
      <Region name="menu" />
    </div>
    <div class="frame-ud__main">
      <!-- 所有页面(首页/内页)都渲染在这里,继承本骨架 + 当前 sign 的皮肤 -->
      <router-view />
      <Region name="floatingButtons" />
    </div>
    <Region name="footer" />
  </div>
</template>

<script setup lang="ts">
import Region from '@web/themes/Region.vue';
</script>

<style lang="scss" scoped>
.frame-ud {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__header {
    background-color: var(--sd-color-bg-secondary, #f8f8f8);
    border-bottom: 1px solid var(--color-border, #ddd);
    font-size: 12px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  }

  &__main {
    flex: 1;
    /* 让开固定顶栏(NavTop 30 + NavMenu 70),否则内容被顶栏遮住 */
    padding-top: 100px;
    background-color: var(--color-gray-4, #f5f5f5);
  }
}
</style>
