<template>
  <!-- 首页-游戏入口:按 category 复用(体育/真人/电子/棋牌/捕鱼/电竞)。数据来自 thirdGameList。 -->
  <HomeEntrySection :title="title" :items="items" @select="onSelect" @more="onMore" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@shared/stores/commonStore';
import HomeEntrySection, { type EntryItem } from '@web/themes/regions/_HomeEntrySection.vue';

// 由页面通过 <Region name="homeGame" category="sport" /> 传入
const props = defineProps<{ category: string }>();

// category → 顶栏已有的 i18n 标题 key(复用,无需新增翻译)
const TITLE_KEY: Record<string, string> = {
  sport:   'components.nav.menuSport',
  live:    'components.nav.menuLive',
  slot:    'components.nav.menuSlot',
  chess:   'components.nav.menuChess',
  fishing: 'components.nav.menuFishing',
  e_sport: 'components.nav.menuEsport',
  mini_game: 'components.nav.menuMiniGame',
};

const { t } = useI18n();
const router = useRouter();
const store = useCommonStore();

const title = computed(() => {
  const key = TITLE_KEY[props.category];
  return key ? t(key) : props.category;
});

const items = computed<EntryItem[]>(() => (store.thirdGameList as any)?.[props.category] ?? []);

const onSelect = (it: EntryItem) => router.push(`/game/${props.category}/${it.sign}`);
const onMore = () => router.push(`/game/${props.category}`);
</script>
