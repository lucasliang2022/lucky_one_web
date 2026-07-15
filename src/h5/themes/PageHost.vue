<template>
  <!-- 页面占位:路由指向本组件并传 name,按当前 sign 解析出对应页面组件(sign→default 兜底)。
       路由参数(route.params)透传给解析出的页面,兼容 props:true 风格的页面。 -->
  <component :is="page" v-bind="route.params" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCommonStore } from '@shared/stores/commonStore';
import { resolveSign } from '@h5/themes/resolveTheme';
import { pageOf } from '@h5/themes/resolve';

const props = defineProps<{ name: string }>();
const route = useRoute();
const commonStore = useCommonStore();
const page = computed(() => pageOf(props.name, resolveSign(commonStore.tenant?.theme)));
</script>
