<template>
  <div class="nav-menu-container">
    <div class="nav-menu">

      <div class="nav-logo" @click="goHome">
        <img :src="logo" alt="logo" />
      </div>

      <ul class="nav-menu-list flex items-center height-100">

        <li class="flex items-center height-100">
          <el-dropdown
              placement="bottom"
              :show-timeout="50"
              class="flex items-center height-100"
              ref="lotteryDropdownRef"
              :teleported="false"
              popper-class="lottery-sub-menu"
          >
            <div class="nav-menu-item flex items-center height-100" @click="goLotteryHome">
              {{ t('components.nav.menuLottery') }}
              <span class="sd-menu-icon icon-sd-down-btn"></span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <div class="lottery-list-wrapper">
                  <div
                      v-for="group in lotteryGroups"
                      :key="group.sign"
                      class="lottery-group"
                  >
                    <div class="lg-title">
                      <span class="sd-icon" :class="group.iconClass" :style="{ color: group.color }"></span>
                      {{ t(group.labelKey) }}
                    </div>
                    <div class="lg-list">
                      <div
                          v-for="lottery in group.items"
                          :key="lottery.sign"
                          class="lg-list-item"
                          @click="goLottery(group.sign, lottery.sign)"
                      >
                        <span class="lg-list-item-title">{{ lottery.title }}</span>
                        <span v-if="lottery.is_hot" class="tag tag-hot">HOT</span>
                        <span v-if="lottery.is_new" class="tag tag-new">NEW</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>

        <li v-if="chessGames.length" class="flex items-center height-100">
          <el-dropdown
              placement="bottom"
              :show-timeout="50"
              :teleported="false"
              popper-class="game-sub-menu"
          >
            <div class="nav-menu-item flex items-center height-100" @click="goCategoryHome('chess')">
              {{ t('components.nav.menuChess') }}
              <span class="sd-menu-icon icon-sd-down-btn"></span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <div class="game-icon-wrapper">
                  <div class="game-icon-grid">
                    <div
                        v-for="game in chessGames"
                        :key="game.sign"
                        class="game-icon-item"
                        @click="goGame('chess', game.sign)"
                    >
                      <div class="icon-box">
                        <img v-if="game.logo" :src="game.logo" :alt="game.title" />
                        <div v-else class="logo-placeholder">{{ game.title.charAt(0) }}</div>
                      </div>
                      <div class="game-name">{{ game.title }}</div>
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>

        <li v-if="sportGames.length" class="flex items-center height-100">
          <el-dropdown
              placement="bottom"
              :show-timeout="50"
              :teleported="false"
              popper-class="game-sub-menu"
          >
            <div class="nav-menu-item flex items-center height-100" @click="goCategoryHome('sport')">
              {{ t('components.nav.menuSport') }}
              <span class="sd-menu-icon icon-sd-down-btn"></span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <div class="game-icon-wrapper">
                  <div class="game-icon-grid">
                    <div
                        v-for="game in sportGames"
                        :key="game.sign"
                        class="game-icon-item"
                        @click="goGame('sport', game.sign)"
                    >
                      <div class="icon-box">
                        <img v-if="game.logo" :src="game.logo" :alt="game.title" />
                        <div v-else class="logo-placeholder">{{ game.title.charAt(0) }}</div>
                      </div>
                      <div class="game-name">{{ game.title }}</div>
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>

        <li v-if="liveGames.length" class="flex items-center height-100">
          <el-dropdown
              placement="bottom"
              :show-timeout="50"
              :teleported="false"
              popper-class="game-sub-menu"
          >
            <div class="nav-menu-item flex items-center height-100" @click="goCategoryHome('live')">
              {{ t('components.nav.menuLive') }}
              <span class="sd-menu-icon icon-sd-down-btn"></span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <div class="game-icon-wrapper">
                  <div class="game-icon-grid">
                    <div
                        v-for="game in liveGames"
                        :key="game.sign"
                        class="game-icon-item"
                        @click="goGame('live', game.sign)"
                    >
                      <div class="icon-box">
                        <img v-if="game.logo" :src="game.logo" :alt="game.title" />
                        <div v-else class="logo-placeholder">{{ game.title.charAt(0) }}</div>
                      </div>
                      <div class="game-name">{{ game.title }}</div>
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>

        <li v-if="slotGames.length" class="flex items-center height-100">
          <el-dropdown
              placement="bottom"
              :show-timeout="50"
              :teleported="false"
              popper-class="game-sub-menu"
          >
            <div class="nav-menu-item flex items-center height-100" @click="goCategoryHome('slot')">
              {{ t('components.nav.menuSlot') }}
              <span class="sd-menu-icon icon-sd-down-btn"></span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <div class="game-icon-wrapper">
                  <div class="game-icon-grid">
                    <div
                        v-for="game in slotGames"
                        :key="game.sign"
                        class="game-icon-item"
                        @click="goGame('slot', game.sign)"
                    >
                      <div class="icon-box">
                        <img v-if="game.logo" :src="game.logo" :alt="game.title" />
                        <div v-else class="logo-placeholder">{{ game.title.charAt(0) }}</div>
                      </div>
                      <div class="game-name">{{ game.title }}</div>
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>

        <li v-if="fishingGames.length" class="flex items-center height-100">
          <el-dropdown
              placement="bottom"
              :show-timeout="50"
              :teleported="false"
              popper-class="game-sub-menu"
          >
            <div class="nav-menu-item flex items-center height-100" @click="goCategoryHome('fishing')">
              {{ t('components.nav.menuFishing') }}
              <span class="sd-menu-icon icon-sd-down-btn"></span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <div class="game-icon-wrapper">
                  <div class="game-icon-grid">
                    <div
                        v-for="game in fishingGames"
                        :key="game.sign"
                        class="game-icon-item"
                        @click="goGame('fishing', game.sign)"
                    >
                      <div class="icon-box">
                        <img v-if="game.logo" :src="game.logo" :alt="game.title" />
                        <div v-else class="logo-placeholder">{{ game.title.charAt(0) }}</div>
                      </div>
                      <div class="game-name">{{ game.title }}</div>
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>

        <li v-if="esportGames.length" class="flex items-center height-100">
          <el-dropdown
              placement="bottom"
              :show-timeout="50"
              :teleported="false"
              popper-class="game-sub-menu"
          >
            <div class="nav-menu-item flex items-center height-100" @click="goCategoryHome('e_sport')">
              {{ t('components.nav.menuEsport') }}
              <span class="sd-menu-icon icon-sd-down-btn"></span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <div class="game-icon-wrapper">
                  <div class="game-icon-grid">
                    <div
                        v-for="game in esportGames"
                        :key="game.sign"
                        class="game-icon-item"
                        @click="goGame('e_sport', game.sign)"
                    >
                      <div class="icon-box">
                        <img v-if="game.logo" :src="game.logo" :alt="game.title" />
                        <div v-else class="logo-placeholder">{{ game.title.charAt(0) }}</div>
                      </div>
                      <div class="game-name">{{ game.title }}</div>
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>

        <li class="flex items-center height-100">
          <el-divider direction="vertical" />
        </li>

        <li class="flex items-center height-100">
          <span class="nav-menu-item flex items-center height-100 static-item" @click="goPromo">
            {{ t('components.nav.menuPromo') }}
          </span>
        </li>
        <li class="flex items-center height-100">
          <span class="nav-menu-item flex items-center height-100 static-item" @click="goSupport">
            {{ t('components.nav.menuSupport') }}
          </span>
        </li>
        <li class="flex items-center height-100">
          <span class="nav-menu-item flex items-center height-100 static-item" @click="goApp">
            {{ t('components.nav.menuApp') }}
          </span>
        </li>

      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter }     from 'vue-router';
import { useI18n }       from 'vue-i18n';
import { useCommonStore } from '@/stores/commonStore';

interface LotteryItem {
  sign: string;
  title: string;
  is_hot?: boolean;
  is_new?: boolean;
}

interface LotteryGroup {
  sign: string;
  labelKey: string;
  iconClass: string;
  color: string;
  items: LotteryItem[];
}

const { t }              = useI18n();
const commonStore        = useCommonStore();
const router             = useRouter();
const lotteryDropdownRef = ref<any>(null);

const logo = computed(() => commonStore.partner?.logo || '/images/logo.png');

const chessGames   = computed(() => (commonStore.thirdGameList as any)?.chess   ?? []);
const sportGames   = computed(() => (commonStore.thirdGameList as any)?.sport   ?? []);
const liveGames    = computed(() => (commonStore.thirdGameList as any)?.live    ?? []);
const slotGames    = computed(() => (commonStore.thirdGameList as any)?.slot    ?? []);
const fishingGames = computed(() => (commonStore.thirdGameList as any)?.fishing ?? []);
const esportGames  = computed(() => (commonStore.thirdGameList as any)?.e_sport ?? []);

const LOTTERY_CATEGORY_ORDER = [
  { sign: 'ssc',   labelKey: 'components.nav.menuSsc',   iconClass: 'icon-sd-ssc',      color: '#F5A623' },
  { sign: 'sd',    labelKey: 'components.nav.menuSd',    iconClass: 'icon-sd-sd',       color: '#5D4FFF' },
  { sign: 'ks',    labelKey: 'components.nav.menuKs',    iconClass: 'icon-sd-ks',       color: '#FA5555' },
  { sign: 'lhc',   labelKey: 'components.nav.menuLhc',   iconClass: 'icon-sd-icon-lhc', color: '#488ded' },
  { sign: 'pk10',  labelKey: 'components.nav.menuPk10',  iconClass: 'icon-sd-pk10',     color: '#67C23A' },
  { sign: 'lotto', labelKey: 'components.nav.menuLotto', iconClass: 'icon-sd-lotto',    color: '#DC2626' },
  { sign: 'p3p5',  labelKey: 'components.nav.menuP3p5',  iconClass: 'icon-sd-p3p5',     color: '#7C3AED' },
  { sign: 'kl28',  labelKey: 'components.nav.menuKl28',  iconClass: 'icon-sd-kl28',     color: '#06B6D4' },
  { sign: 'hash',  labelKey: 'components.nav.menuHash',  iconClass: 'icon-sd-hash',     color: '#F59E0B' },
];

const lotteryGroups = computed<LotteryGroup[]>(() => {
  const map = commonStore.lotteryList as Record<string, LotteryItem[]> | null | undefined;
  if (!map || typeof map !== 'object') return [];
  const result: LotteryGroup[] = [];
  for (const cat of LOTTERY_CATEGORY_ORDER) {
    const raw = (map as any)[cat.sign];
    const items: LotteryItem[] = Array.isArray(raw) ? raw : [];
    if (items.length === 0) continue;
    result.push({ ...cat, items });
  }
  return result;
});

const closeLotteryMenu = () => lotteryDropdownRef.value?.handleClose?.();

const goLottery = (categorySign: string, lotterySign: string) => {
  closeLotteryMenu();
  router.push({
    name: 'lottery',
    params: { category: categorySign, sign: lotterySign },
  });
};

const goLotteryHome = () => {
  const first = lotteryGroups.value[0];
  if (first && first.items.length) {
    goLottery(first.sign, first.items[0].sign);
    return;
  }
  router.push('/');
};

const goCategoryHome = (category: string) => router.push(`/game/${category}`);
const goGame         = (category: string, sign: string) => router.push(`/game/${category}/${sign}`);

const goHome    = () => router.push('/');
const goPromo   = () => router.push('/promo');
const goSupport = () => router.push('/support');
const goApp     = () => router.push('/app');
</script>

<style lang="scss">
.nav-menu-container {
  background-color: var(--hm-bg-color);

  .nav-menu {
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: var(--width-small-container);
    max-width: var(--width-container);
    margin: 0 auto;
    padding: 0 20px;

    .nav-logo {
      cursor: pointer;
      img { height: 40px; object-fit: contain; }
    }

    .nav-menu-list {
      list-style: none;
      padding: 0;
      gap: 20px;

      .el-dropdown {
        position: inherit;
        height: 100%;
      }

      .nav-menu-item {
        position: relative;
        cursor: pointer;
        padding-left: 2.5em;
        font-size: 14px;
        color: var(--color-text-primary, #333);
        white-space: nowrap;
        user-select: none;
        transition: color 0.2s;

        &:hover { color: var(--color-primary-1, #e4393c); }

        &.static-item { padding-left: 0; }
      }
    }
  }
}

.lottery-sub-menu {
  overflow: hidden;
  justify-content: center;
  left: 0 !important;
  top: 100px !important;

  .lottery-list-wrapper {
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    box-sizing: border-box;
    overflow-y: auto;
    -ms-overflow-style: none;
    margin: 15px 0;
    padding: 0 20px;
    max-height: calc(100vh - 140px);
    gap: 8px;

    &::-webkit-scrollbar { display: none; }

    .lottery-group {
      flex: 0 0 auto;
      min-width: 150px;
      padding: 0 12px;
      border-right: 1px dashed var(--color-gray-2);

      &:last-child { border-right: none; }

      .lg-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 600;
        margin: 10px 0 12px;
        color: #333;

        .sd-icon { font-size: 18px; }
      }

      .lg-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding-bottom: 10px;
      }

      .lg-list-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        background-color: var(--color-background, #fff);
        border: 1px solid var(--color-gray-3);
        border-radius: 4px;
        width: 100%;
        min-width: 120px;
        height: 32px;
        cursor: pointer;
        text-align: center;
        font-size: 12px;
        line-height: 1;
        transition: all 0.2s;
        white-space: nowrap;

        .lg-list-item-title { display: inline-block; }

        &:hover {
          border-color: var(--color-primary-1, #e4393c);
          background-color: var(--color-primary-lighten-3, #fff1f1);
          color: var(--color-primary-1, #e4393c);
        }

        .tag {
          padding: 0 4px;
          height: 14px;
          line-height: 14px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          border-radius: 7px;

          &.tag-hot { background: #ef4444; }
          &.tag-new { background: #22c55e; }
        }
      }
    }
  }
}

.game-sub-menu {
  overflow: hidden;
  justify-content: center;
  left: 0 !important;
  top: 100px !important;

  .game-icon-wrapper {
    width: 100vw;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none;
    padding: 20px 0;

    &::-webkit-scrollbar { display: none; }
  }

  .game-icon-grid {
    width: 100%;
    max-width: var(--width-container, 1200px);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    padding: 0 30px;
    box-sizing: border-box;
  }

  .game-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--color-primary-lighten-3, #f0f7ff);
      transform: translateY(-2px);

      .icon-box  { box-shadow: 0 4px 12px rgba(50, 107, 199, 0.2); }
      .game-name { color: var(--color-primary-1, #326BC7); }
    }

    .icon-box {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      transition: box-shadow 0.2s;

      img { width: 100%; height: 100%; object-fit: contain; }
      .logo-placeholder {
        font-size: 28px;
        font-weight: 700;
        color: #326BC7;
      }
    }

    .game-name {
      font-size: 12px;
      color: #333;
      text-align: center;
      transition: color 0.2s;
      white-space: nowrap;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>