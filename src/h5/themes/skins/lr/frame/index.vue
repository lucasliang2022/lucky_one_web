<template>
  <!-- lr 骨架占位(sign='lr' 时启用):移动端另一种骨架示例(仅顶部标题 + 内容 + 底部 tabbar)。
       lr 没有自己的 pages/main.css,页面与皮肤回落 default,证明「多皮肤 + frame 覆盖 + 回落」。 -->
  <van-config-provider class="frame-lr-h5">
    <van-nav-bar :title="t('h5.home.title')" />
    <div class="frame-lr-h5__body">
      <router-view />
    </div>
    <Region name="tabbar" />
  </van-config-provider>
</template>

<script setup lang="ts">
import Region from '@h5/themes/Region.vue';
import { t } from '@shared/i18n';
</script>

<style lang="scss" scoped>
.frame-lr-h5 {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__body {
    flex: 1;
    padding-bottom: 50px;
    background-color: var(--h5-color-bg, #f7f8fa);
  }
}
</style>
