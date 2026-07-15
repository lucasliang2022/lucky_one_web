<template>
  <div class="page-h5-home">
    <!-- 块1 · 顶部轮播图 -->
    <van-swipe class="home-banner" :autoplay="3000" indicator-color="white" lazy-render>
      <van-swipe-item v-for="(b, i) in banners" :key="i">
        <div class="home-banner__slide" :style="{ background: b.bg }">
          {{ b.text }}
        </div>
      </van-swipe-item>
    </van-swipe>

    <!-- 块2 · 欢迎 + 快捷按钮 -->
    <div class="home-welcome">
      <div class="home-welcome__hello" @click="onWelcomeClick">
        <van-icon name="manager-o" class="home-welcome__avatar" />
        <span class="home-welcome__text">{{ welcomeText }}</span>
      </div>
      <van-grid :column-num="4" :border="false" class="home-welcome__quick">
        <van-grid-item
          v-for="q in quickActions"
          :key="q.key"
          :icon="q.icon"
          :text="q.text"
          @click="onQuick(q.key)"
        />
      </van-grid>
    </div>

    <!-- 块3 · 游戏区域 -->
    <div class="home-games">
      <div class="home-games__head">
        <van-tabs v-model:active="activeGameTab" shrink class="home-games__tabs">
          <van-tab v-for="gt in gameTabs" :key="gt.key" :title="gt.title" :name="gt.key" />
        </van-tabs>
        <span class="home-games__more" @click="onMore">{{ t('h5.home.game.more') }}</span>
      </div>

      <div class="home-games__body">
        <!-- 左:竖向游戏分类 -->
        <van-sidebar v-model="activeCategory" class="home-games__sidebar">
          <van-sidebar-item
            v-for="cat in categories"
            :key="cat.key"
            :title="cat.title"
            @click="onCategory(cat)"
          />
        </van-sidebar>

        <!-- 右:对应场馆(与左侧分类联动) -->
        <div class="home-games__venues">
          <van-grid :column-num="3" :gutter="8" :border="false">
            <van-grid-item v-for="v in currentVenues" :key="v.id" @click="onVenue(v)">
              <div class="venue-card">
                <div class="venue-card__logo" :style="{ background: v.bg }">
                  {{ v.name.slice(0, 1) }}
                </div>
                <div class="venue-card__name">{{ v.name }}</div>
              </div>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
// 共享内核:store 来自 @shared,与 web 端同一份
import { useUserStore } from '@shared/stores/userStore';
import { t } from '@shared/i18n';

const router = useRouter();
const userStore = useUserStore();

/* ---------- 块1 轮播占位数据 ---------- */
const banners = [
  { bg: 'linear-gradient(135deg,#1989fa,#39a9ff)', text: t('h5.home.banner.slide1') },
  { bg: 'linear-gradient(135deg,#ff6034,#ee0a24)', text: t('h5.home.banner.slide2') },
  { bg: 'linear-gradient(135deg,#7232dd,#a556f6)', text: t('h5.home.banner.slide3') },
];

/* ---------- 块2 欢迎 + 快捷按钮 ---------- */
const welcomeText = computed(() =>
  userStore.isLoggedIn
    ? t('h5.home.welcome', { name: userStore.username || '-' })
    : t('h5.home.welcomeGuest'),
);

// key 对应将来真实路由/动作,占位先 toast/push
const quickActions = [
  { key: 'recharge', icon: 'gold-coin-o', text: t('h5.home.quick.recharge') },
  { key: 'withdraw', icon: 'cash-back-record-o', text: t('h5.home.quick.withdraw') },
  { key: 'transfer', icon: 'exchange', text: t('h5.home.quick.transfer') },
  { key: 'service', icon: 'service-o', text: t('h5.home.quick.service') },
] as const;

function onWelcomeClick(): void {
  if (!userStore.isLoggedIn) router.push('/login');
}

function onQuick(key: string): void {
  if (key === 'recharge') {
    router.push('/recharge');
    return;
  }
  // withdraw / transfer / service 暂无页面,占位提示
  showToast(t(`h5.home.quick.${key}`));
}

/* ---------- 块3 游戏区域 ---------- */
const gameTabs = [
  { key: 'hot', title: t('h5.home.game.tab.hot') },
  { key: 'fav', title: t('h5.home.game.tab.fav') },
  { key: 'recent', title: t('h5.home.game.tab.recent') },
];
const activeGameTab = ref<string>('hot');

// 左侧分类 + 每类下的场馆(占位)。将来替换成 commonStore.thirdGameList 之类的形态。
interface Venue {
  id: string;
  name: string;
  bg: string;
}
interface GameCategory {
  key: string;
  title: string;
  venues: Venue[];
}

const VENUE_BGS = ['#f2f3f5', '#e8f3ff', '#fff1e8', '#f0f9eb', '#fef0f0', '#f4ecfb'];
function makeVenues(prefix: string): Venue[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    name: `${prefix}${i + 1}`,
    bg: VENUE_BGS[i % VENUE_BGS.length],
  }));
}

const categories: GameCategory[] = [
  { key: 'slots', title: t('h5.home.game.category.slots'), venues: makeVenues('电子') },
  { key: 'live', title: t('h5.home.game.category.live'), venues: makeVenues('真人') },
  { key: 'chess', title: t('h5.home.game.category.chess'), venues: makeVenues('棋牌') },
  { key: 'lottery', title: t('h5.home.game.category.lottery'), venues: makeVenues('彩票') },
  { key: 'fishing', title: t('h5.home.game.category.fishing'), venues: makeVenues('捕鱼') },
];

const activeCategory = ref<number>(0);
const currentVenues = computed<Venue[]>(() => categories[activeCategory.value]?.venues ?? []);

function onMore(): void {
  showToast(t('h5.home.game.more'));
}
// 点「彩票」分类 → 进真实彩票大厅;其余占位分类保持不变。
function onCategory(cat: GameCategory): void {
  if (cat.key === 'lottery') router.push('/lottery');
}
function onVenue(v: Venue): void {
  // 当前分类为「彩票」时,点卡片同样进彩票大厅;其它分类保持占位提示。
  if (categories[activeCategory.value]?.key === 'lottery') {
    router.push('/lottery');
    return;
  }
  showToast(v.name);
}

onMounted(() => {
  // 已登录则用共享 store 的方法拉取用户信息 / 余额
  if (userStore.token) {
    if (!userStore.isUserLoaded) userStore.initUserInfo();
    if (!userStore.isBalanceLoaded) userStore.fetchBalance();
  }
});
</script>

<style lang="scss">
.page-h5-home {
  /* 块1 轮播 */
  .home-banner {
    &__slide {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 150px;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }

  /* 块2 欢迎 + 快捷 */
  .home-welcome {
    margin: 8px 12px;
    padding: 12px;
    background: #fff;
    border-radius: 10px;

    &__hello {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    &__avatar {
      font-size: 22px;
      color: var(--van-primary-color, #1989fa);
      margin-right: 6px;
    }
    &__text {
      font-size: 15px;
      font-weight: 500;
    }
    &__quick {
      :deep(.van-grid-item__content) {
        padding: 10px 0;
      }
    }
  }

  /* 块3 游戏区域 */
  .home-games {
    margin: 8px 12px;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;

    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 12px;
      border-bottom: 1px solid var(--van-border-color, #ebedf0);
    }
    &__tabs {
      flex: 1;
    }
    &__more {
      flex-shrink: 0;
      font-size: 12px;
      color: var(--van-gray-6, #969799);
      white-space: nowrap;
    }
    &__body {
      display: flex;
      min-height: 320px;
    }
    &__sidebar {
      width: 84px;
      flex-shrink: 0;
    }
    &__venues {
      flex: 1;
      padding: 8px 4px;
    }
  }

  .venue-card {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__logo {
      width: 46px;
      height: 46px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
      color: var(--van-primary-color, #1989fa);
    }
    &__name {
      margin-top: 6px;
      font-size: 12px;
      color: var(--van-text-color, #323233);
    }
  }
}
</style>
