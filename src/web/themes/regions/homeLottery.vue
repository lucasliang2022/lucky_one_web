<template>
  <!-- 首页-重要彩票入口:跨分类汇总热门/重点彩种(数据来自 lotteryList,与游戏不同源)。 -->
  <HomeEntrySection :title="title" :items="items" @select="onSelect" @more="onMore" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@shared/stores/commonStore';
import HomeEntrySection, { type EntryItem } from '@web/themes/regions/_HomeEntrySection.vue';

// 首页最多展示的彩种数(优先 is_hot,再按顺序补齐)
const MAX = 12;

const { t } = useI18n();
const router = useRouter();
const store = useCommonStore();

const title = computed(() => t('components.nav.menuLottery'));

// lotteryList: { [categorySign]: LotteryItem[] } —— 拍平并记住各自 category,用于跳转
interface Flat extends EntryItem { category: string }
const items = computed<Flat[]>(() => {
  const map = store.lotteryList as Record<string, any[]> | null | undefined;
  if (!map || typeof map !== 'object') return [];
  const flat: Flat[] = [];
  for (const category of Object.keys(map)) {
    const list = Array.isArray(map[category]) ? map[category] : [];
    for (const l of list) {
      flat.push({ sign: l.sign, title: l.title, is_hot: l.is_hot, is_new: l.is_new, category });
    }
  }
  // 热门优先,其余保持原顺序;截断到 MAX
  const hot = flat.filter((x) => x.is_hot);
  const rest = flat.filter((x) => !x.is_hot);
  return [...hot, ...rest].slice(0, MAX);
});

const onSelect = (it: EntryItem) => {
  const f = it as Flat;
  router.push({ name: 'lottery', params: { category: f.category, sign: f.sign } });
};
// “更多”跳到第一个彩种分类首页(无则回首页)
const onMore = () => {
  const first = items.value[0];
  if (first) router.push({ name: 'lottery', params: { category: first.category, sign: first.sign } });
  else router.push('/');
};
</script>
