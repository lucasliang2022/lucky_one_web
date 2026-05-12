<template>
  <div class="nav-menu-container">
    <div class="nav-menu">

      <!-- Logo -->
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

                  <!-- 六合彩 -->
                  <div class="lottery-group" v-if="lotteryLhcList.length">
                    <div class="lg-title">
                      <span class="sd-icon icon-sd-icon-lhc" style="color: #488ded;"></span>
                      {{ t('components.nav.menuLhc') }}
                    </div>
                    <div class="lg-list">
                      <div
                          v-for="lottery in lotteryLhcList"
                          :key="lottery.sign"
                          class="lg-list-item"
                          @click="goLotteryLhc(lottery.sign)"
                      >
                        {{ lottery.title }}
                      </div>
                    </div>
                  </div>

                  <!-- 赛车 / PK10 -->
                  <div class="lottery-group" v-if="lotteryPk10List.length">
                    <div class="lg-title">
                      <span class="sd-icon icon-sd-pk10" style="color: #67C23A;"></span>
                      {{ t('components.nav.menuPk10') }}
                    </div>
                    <div class="lg-list">
                      <div
                          v-for="lottery in lotteryPk10List"
                          :key="lottery.sign"
                          class="lg-list-item"
                          @click="goLotteryPk10(lottery.sign)"
                      >
                        {{ lottery.title }}
                      </div>
                    </div>
                  </div>

                  <!-- 时时彩 -->
                  <div class="lottery-group" v-if="lotterySscList.length">
                    <div class="lg-title">
                      <span class="sd-icon icon-sd-ssc" style="color: #F5A623;"></span>
                      {{ t('components.nav.menuSsc') }}
                    </div>
                    <div class="lg-list">
                      <div
                          v-for="lottery in lotterySscList"
                          :key="lottery.sign"
                          class="lg-list-item"
                          @click="goLotterySsc(lottery.sign)"
                      >
                        {{ lottery.title }}
                      </div>
                    </div>
                  </div>

                  <!-- 快三 -->
                  <div class="lottery-group" v-if="lotteryKsList.length">
                    <div class="lg-title">
                      <span class="sd-icon icon-sd-ks" style="color: #FA5555;"></span>
                      {{ t('components.nav.menuKs') }}
                    </div>
                    <div class="lg-list">
                      <div
                          v-for="lottery in lotteryKsList"
                          :key="lottery.sign"
                          class="lg-list-item"
                          @click="goLotteryKs(lottery.sign)"
                      >
                        {{ lottery.title }}
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

const { t }              = useI18n();
const commonStore        = useCommonStore();
const router             = useRouter();
const lotteryDropdownRef = ref<any>(null);

/* ---------- Logo ---------- */
const logo = computed(() => commonStore.partner?.logo || '/images/logo.png');

/* ---------- 三方游戏按 category 取（[{sign, account_sign, title, logo}]）---------- */
const chessGames   = computed(() => commonStore.thirdGameList?.chess   ?? []);
const sportGames   = computed(() => commonStore.thirdGameList?.sport   ?? []);
const liveGames    = computed(() => commonStore.thirdGameList?.live    ?? []);
const slotGames    = computed(() => commonStore.thirdGameList?.slot    ?? []);
const fishingGames = computed(() => commonStore.thirdGameList?.fishing ?? []);
const esportGames  = computed(() => commonStore.thirdGameList?.e_sport ?? []);

/* ---------- 彩票按 category_sign 分组 ---------- */
const lotteryLhcList  = computed(() => filterLottery('lhc'));
const lotteryPk10List = computed(() => filterLottery('pk10'));
const lotterySscList  = computed(() => filterLottery('ssc'));
const lotteryKsList   = computed(() => filterLottery('ks'));

function filterLottery(categorySign: string): { sign: string; title: string }[] {
  const list = commonStore.lotteryList as any[];
  if (!Array.isArray(list)) return [];
  return list.filter((l: any) => l.category_sign === categorySign);
}

/* ---------- 关闭彩票下拉（用于点击具体彩种后） ---------- */
const closeLotteryMenu = () => lotteryDropdownRef.value?.handleClose?.();

/* ---------- 彩票导航 ---------- */
const goLotteryHome = () => router.push('/lottery');
const goLotteryLhc  = (sign: string) => { closeLotteryMenu(); router.push({ name: 'lotteryLhc',  params: { sign } }); };
const goLotterySsc  = (sign: string) => { closeLotteryMenu(); router.push({ name: 'lotterySsc',  params: { sign } }); };
const goLotteryKs   = (sign: string) => { closeLotteryMenu(); router.push({ name: 'lotteryKs',   params: { sign } }); };
const goLotteryPk10 = (sign: string) => { closeLotteryMenu(); router.push({ name: 'lotteryPk10', params: { sign } }); };

/* ---------- 三方游戏导航 ---------- */
const goCategoryHome = (category: string) => router.push(`/game/${category}`);
const goGame         = (category: string, sign: string) => router.push(`/game/${category}/${sign}`);

/* ---------- 静态入口 ---------- */
const goHome    = () => router.push('/');
const goPromo   = () => router.push('/promo');
const goSupport = () => router.push('/support');
const goApp     = () => router.push('/app');
</script>

<style lang="scss">

/* ========================================================
   容器
   ======================================================== */
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

    /* ========================================================
       菜单列表
       ======================================================== */
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

/* ========================================================
   彩票游戏：全宽下拉
   ======================================================== */
.lottery-sub-menu {
  overflow: hidden;
  justify-content: center;
  left: 0 !important;
  top: 100px !important;

  .lottery-list-wrapper {
    width: 100vw;
    display: flex;
    justify-content: center;
    overflow-x: hidden;
    box-sizing: border-box;
    overflow-y: auto;
    -ms-overflow-style: none;
    margin: 15px 0;

    &::-webkit-scrollbar { display: none; }

    .lottery-group {
      border-right: 1px dashed var(--color-gray-2);
      padding: 0 15px;

      &:last-child { border-right: none; }

      .lg-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 600;
        margin: 10px 0;
        color: #333;

        .sd-icon { font-size: 18px; }
      }

      .lg-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding-bottom: 10px;
      }

      .lg-list-item {
        background-color: var(--color-background, #fff);
        border: 1px solid var(--color-gray-3);
        border-radius: 4px;
        width: 95px;
        cursor: pointer;
        text-align: center;
        font-size: 12px;
        line-height: 26px;
        transition: all 0.2s;

        &:hover {
          border-color: var(--color-primary-1, #e4393c);
          background-color: var(--color-primary-lighten-3, #fff1f1);
          color: var(--color-primary-1, #e4393c);
        }
      }
    }
  }
}

/* ========================================================
   游戏分类下拉：图标网格
   结构和彩票完全对称：100vw 外壳 + 居中 max-width 内容 + 两端 padding
   ======================================================== */
.game-sub-menu {
  overflow: hidden;
  justify-content: center;
  left: 0 !important;
  top: 100px !important;

  /* ★ 外层：100vw 全宽，flex 居中其内部网格（跟 .lottery-list-wrapper 同套路）*/
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

  /* ★ 内层：max-width 限制，padding 留两端空白 */
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