<template>
  <div class="page-h5-lottery">
    <van-nav-bar :title="t('h5.page.lottery.title')" />

    <!-- config 未加载:加载态 -->
    <van-loading v-if="!isLoaded" class="page-h5-lottery__loading" vertical>
      {{ t('h5.page.lottery.loading') }}
    </van-loading>

    <!-- 已加载但没有任何分类/彩种:空态 -->
    <van-empty
      v-else-if="categories.length === 0"
      :description="t('h5.page.lottery.empty')"
    />

    <!-- 真实彩票大厅:按分类分段 -->
    <template v-else>
      <section
        v-for="cat in categories"
        :key="cat.sign"
        class="lottery-cat"
      >
        <div class="lottery-cat__title">{{ categoryTitle(cat.sign) }}</div>
        <van-grid :column-num="3" :gutter="8" :border="false">
          <van-grid-item
            v-for="item in cat.items"
            :key="item.sign"
            @click="onPick(cat.sign, item)"
          >
            <div class="lottery-card">
              <div class="lottery-card__name">{{ item.title }}</div>
              <div class="lottery-card__badges">
                <van-tag v-if="item.is_hot" type="danger" round>
                  {{ t('h5.page.lottery.hot') }}
                </van-tag>
                <van-tag v-if="item.is_new" type="success" round>
                  {{ t('h5.page.lottery.new') }}
                </van-tag>
              </div>
            </div>
          </van-grid-item>
        </van-grid>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
// 彩票大厅:读 @shared/commonStore 的真实彩种数据,按分类分段展示。
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@shared/stores/commonStore';
import type { LotteryListItem } from '@shared/types/common';
import { t } from '@shared/i18n';

const router = useRouter();
const commonStore = useCommonStore();
const { isLoaded } = storeToRefs(commonStore);

// 已内置中文/英文标题的分类 sign;未知分类回落显示原始 sign,避免裸键。
const KNOWN_CATEGORIES = new Set(['ssc', 'sd', 'ks', 'lhc', 'pk10', 'kl28']);

interface CategorySection {
  sign: string;
  items: LotteryListItem[];
}

// 遍历真实分类,过滤掉没有彩种的分类。
const categories = computed<CategorySection[]>(() =>
  commonStore
    .getAllLotteryCategories()
    .map((sign) => ({ sign, items: commonStore.getLotteriesByCategory(sign) }))
    .filter((c) => c.items.length > 0),
);

function categoryTitle(sign: string): string {
  return KNOWN_CATEGORIES.has(sign) ? t(`h5.page.lottery.category.${sign}`) : sign;
}

function onPick(category: string, item: LotteryListItem): void {
  router.push(`/lottery/${category}/${item.sign}`);
}
</script>

<style lang="scss">
.page-h5-lottery {
  &__loading {
    padding: 40px 0;
  }

  .lottery-cat {
    margin: 8px 12px;
    padding: 12px;
    background: #fff;
    border-radius: 10px;

    &__title {
      margin-bottom: 8px;
      font-size: 15px;
      font-weight: 600;
      color: var(--van-text-color, #323233);
    }
  }

  .lottery-card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48px;
    border-radius: 8px;
    background: var(--van-gray-1, #f7f8fa);

    &__name {
      font-size: 13px;
      font-weight: 500;
      color: var(--van-text-color, #323233);
    }

    &__badges {
      position: absolute;
      top: -6px;
      right: -4px;
      display: flex;
      gap: 2px;
      transform: scale(0.85);
      transform-origin: top right;
    }
  }
}
</style>
