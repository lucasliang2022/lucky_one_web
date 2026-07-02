<template>
  <!-- 尾部:base = 简单版权条(占位,主题可覆盖成完整页脚) -->
  <footer class="footer-region">
    <span>© {{ title }}</span>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCommonStore } from '@/stores/commonStore';

const commonStore = useCommonStore();
const title = computed(() => commonStore.partner?.title ?? '');
</script>

<style lang="scss" scoped>
.footer-region {
  padding: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--sd-color-txt-tertiary, #999);
  background: var(--sd-color-bg-secondary, #fff);
  border-top: 1px solid var(--color-border, #eee);
}
</style>
