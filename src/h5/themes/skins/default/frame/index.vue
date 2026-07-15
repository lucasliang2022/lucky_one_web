<template>
  <!-- default 移动骨架:van-config-provider 包裹,内容区 <router-view/> + 底部 tabbar(公共 region 占位)。
       页面(首页/内页)都渲染在 body 里,继承本骨架 + 当前 sign 皮肤。 -->
  <van-config-provider class="frame-h5">
    <div class="frame-h5__body">
      <router-view />
    </div>
    <!-- 底部标签栏走 Region 机制:皮肤覆盖 skins/<sign>/regions/tabbar.vue → 公共 regions/tabbar.vue 兜底 -->
    <Region name="tabbar" />
  </van-config-provider>
</template>

<script setup lang="ts">
import Region from '@h5/themes/Region.vue';
</script>

<style lang="scss" scoped>
.frame-h5 {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__body {
    flex: 1;
    /* 给底部固定 tabbar 预留空间 */
    padding-bottom: 50px;
    background-color: var(--h5-color-bg, #f7f8fa);
  }
}
</style>
