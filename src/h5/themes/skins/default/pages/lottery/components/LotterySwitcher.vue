<template>
  <div class="lottery-switcher">
    <div class="lottery-switcher__header">
      <span class="lottery-switcher__title">{{ t('h5.ssc.switcher.title') }}</span>
      <van-icon name="cross" class="lottery-switcher__close" @click="emit('close')" />
    </div>

    <div class="lottery-switcher__body">
      <van-empty
        v-if="categories.length === 0"
        :description="t('h5.ssc.switcher.empty')"
      />

      <section
        v-for="cat in categories"
        :key="cat.sign"
        class="lottery-switcher__cat"
      >
        <div class="lottery-switcher__cat-title">{{ categoryTitle(cat.sign) }}</div>
        <div class="lottery-switcher__grid">
          <div
            v-for="item in cat.items"
            :key="item.sign"
            class="lottery-switcher__item"
            :class="{ 'is-active': item.sign === currentSign }"
            @click="emit('pick', cat.sign, item.sign)"
          >
            <span class="lottery-switcher__item-name">{{ item.title }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 彩种切换弹层内容:遍历共享 commonStore 的真实彩种数据,按分类分段展示全部彩种,高亮当前 sign。
// 点某彩种 → emit('pick', 分类sign, 彩种sign) 交给父页面路由跳转 + 关闭弹层(复用大厅 lottery.vue 的译名/结构)。
import { computed } from 'vue';
import { useCommonStore } from '@shared/stores/commonStore';
import type { LotteryListItem } from '@shared/types/common';
import { t } from '@shared/i18n';

defineProps<{ currentSign: string }>();
const emit = defineEmits<{
  (e: 'pick', category: string, sign: string): void;
  (e: 'close'): void;
}>();

const commonStore = useCommonStore();

// 已内置中英标题的分类 sign;未知分类回落显示原始 sign,避免裸键。与大厅 lottery.vue 保持一致。
const KNOWN_CATEGORIES = new Set(['ssc', 'sd', 'ks', 'lhc', 'pk10', 'kl28']);

interface CategorySection {
  sign: string;
  items: LotteryListItem[];
}

const categories = computed<CategorySection[]>(() =>
  commonStore
    .getAllLotteryCategories()
    .map((sign) => ({ sign, items: commonStore.getLotteriesByCategory(sign) }))
    .filter((c) => c.items.length > 0),
);

function categoryTitle(sign: string): string {
  return KNOWN_CATEGORIES.has(sign) ? t(`h5.page.lottery.category.${sign}`) : sign;
}
</script>

<style lang="scss">
.lottery-switcher {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--van-border-color, #ebedf0);
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--van-text-color, #323233);
  }

  &__close {
    font-size: 20px;
    color: var(--van-gray-6, #969799);
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 8px 12px 16px;
  }

  &__cat {
    margin-top: 12px;

    &:first-child {
      margin-top: 0;
    }
  }

  &__cat-title {
    width: fit-content;
    margin: 0 auto 10px;
    padding: 4px 18px;
    font-size: 16px;
    font-weight: 600;
    color: var(--van-primary-color, #1989fa);
    background: rgba(25, 137, 250, 0.08);
    border: 1px solid rgba(25, 137, 250, 0.22);
    border-radius: 14px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    padding: 0 6px;
    border-radius: 8px;
    background: var(--van-gray-1, #f7f8fa);
    border: 1px solid transparent;

    &.is-active {
      background: rgba(238, 10, 36, 0.08);
      border-color: #ee0a24;
    }
  }

  &__item-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--van-text-color, #323233);

    .lottery-switcher__item.is-active & {
      color: #ee0a24;
    }
  }

  &__item-badges {
    position: absolute;
    top: -6px;
    right: -4px;
    display: flex;
    gap: 2px;
    transform: scale(0.85);
    transform-origin: top right;
  }
}
</style>
