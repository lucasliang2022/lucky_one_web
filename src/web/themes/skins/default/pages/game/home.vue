<template>
  <div class="category-home">
    <!-- 头图 / 宣传位 -->
    <div class="banner" :style="bannerStyle">
      <h1 class="banner-title">{{ categoryTitle }}</h1>
      <p class="banner-desc">{{ t('pages.game.categoryDesc.' + category) }}</p>
    </div>

    <!-- 平台网格 -->
    <div class="platform-section">
      <h2 class="section-title">{{ t('pages.game.choosePlatform') }}</h2>

      <div class="platform-grid">
        <div
            v-for="game in games"
            :key="game.sign"
            class="platform-card"
            @click="enterGame(game)"
        >
          <div class="card-logo">
            <img v-if="game.logo" :src="game.logo" :alt="game.title" />
            <div v-else class="logo-placeholder">{{ game.title.charAt(0) }}</div>
          </div>
          <div class="card-info">
            <h3 class="card-title">{{ game.title }}</h3>
            <span class="card-cta">{{ t('pages.game.enter') }} →</span>
          </div>
        </div>
      </div>

      <div v-if="!games.length" class="empty">
        {{ t('pages.game.noPlatform') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@shared/stores/commonStore';
import type { ThirdGameItem } from '@shared/types/common';

const props = defineProps<{ category: string }>();
const { t } = useI18n();
const router = useRouter();
const commonStore = useCommonStore();

const games = computed<ThirdGameItem[]>(
    () => commonStore.thirdGameList?.[props.category] ?? []
);

const categoryTitle = computed(() => {
  const map: Record<string, string> = {
    sport: t('components.nav.menuSport'),
    chess: t('components.nav.menuChess'),
    live:  t('components.nav.menuLive'),
    slot:  t('components.nav.menuSlot'),
    fishing: t('components.nav.menuFishing'),
    e_sport: t('components.nav.menuEsport'),
  };
  return map[props.category] ?? props.category;
});

const bannerStyle = computed(() => {
  const map: Record<string, string> = {
    sport:   'linear-gradient(135deg, #0F1923 0%, #1E3A5F 100%)',
    chess:   'linear-gradient(135deg, #4A1942 0%, #8B2D6E 100%)',
    live:    'linear-gradient(135deg, #5C0A1F 0%, #C41E3A 100%)',
    slot:    'linear-gradient(135deg, #1A0F33 0%, #5B3FAA 100%)',
    fishing: 'linear-gradient(135deg, #003B5C 0%, #0099CC 100%)',
    e_sport: 'linear-gradient(135deg, #1A0F33 0%, #00D9FF 100%)',
  };
  return { background: map[props.category] ?? '#333' };
});

const enterGame = (game: ThirdGameItem) => {
  router.push(`/game/${props.category}/${game.sign}`);
};
</script>

<style lang="scss" scoped>
.category-home {
  max-width: var(--width-container, 1200px);
  margin: 0 auto;
  padding: 20px;
}

.banner {
  border-radius: 12px;
  padding: 60px 40px;
  margin-bottom: 30px;
  color: #fff;
  text-align: center;

  .banner-title { font-size: 36px; margin: 0 0 8px; font-weight: 700; }
  .banner-desc  { font-size: 14px; opacity: 0.85; margin: 0; }
}

.section-title {
  font-size: 18px;
  margin: 0 0 16px;
  color: #333;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.platform-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #326BC7;
    box-shadow: 0 4px 12px rgba(50, 107, 199, 0.15);
    transform: translateY(-2px);
  }

  .card-logo {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;

    img { width: 100%; height: 100%; object-fit: contain; }
    .logo-placeholder {
      font-size: 24px;
      font-weight: 700;
      color: #326BC7;
    }
  }

  .card-info {
    flex: 1;
    .card-title { font-size: 15px; margin: 0 0 4px; color: #333; }
    .card-cta   { font-size: 12px; color: #326BC7; }
  }
}

.empty {
  padding: 60px;
  text-align: center;
  color: #999;
}
</style>