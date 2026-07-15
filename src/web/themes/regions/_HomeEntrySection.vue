<template>
  <!--
    首页入口区块的通用展示层:标题 + 图标网格。纯展示,不含数据/路由逻辑。
    稳定 class(home-entry / home-entry__card)+ CSS 变量 = 主题化契约:
    主题在 css/{sign}/main.css 里用 [data-sign="X"] .home-entry {...} 即可改样式,无需改本组件。
    items 为空则整块不渲染(与顶部 NavMenu 的分类隐藏行为一致)。
  -->
  <section v-if="items.length" class="home-entry">
    <header class="home-entry__head" @click="$emit('more')">
      <h3 class="home-entry__title">{{ title }}</h3>
      <span class="home-entry__more">›</span>
    </header>

    <div class="home-entry__grid">
      <button
        v-for="it in items"
        :key="it.sign"
        type="button"
        class="home-entry__card"
        @click="$emit('select', it)"
      >
        <span class="home-entry__icon">
          <img v-if="it.logo" :src="it.logo" :alt="it.title" />
          <span v-else class="home-entry__ph">{{ (it.title || '?').charAt(0) }}</span>
        </span>
        <span class="home-entry__name">{{ it.title }}</span>
        <span v-if="it.is_hot" class="home-entry__tag is-hot">HOT</span>
        <span v-else-if="it.is_new" class="home-entry__tag is-new">NEW</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface EntryItem {
  sign: string;
  title: string;
  logo?: string;
  is_hot?: boolean;
  is_new?: boolean;
}

defineProps<{ title: string; items: EntryItem[] }>();
defineEmits<{ (e: 'select', item: EntryItem): void; (e: 'more'): void }>();
</script>

<style lang="scss" scoped>
.home-entry {
  max-width: var(--width-container, 1200px);
  margin: 0 auto;
  padding: 24px 20px 0;

  &__head {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
    margin-bottom: 14px;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--sd-color-txt-primary, #2c3e50);
  }

  &__more {
    font-size: 18px;
    line-height: 1;
    color: var(--sd-color-txt-tertiary, #999);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 14px;
  }

  &__card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    border: 1px solid var(--color-border, #eee);
    border-radius: 10px;
    background: var(--sd-color-bg-secondary, #fff);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;

    &:hover {
      transform: translateY(-2px);
      border-color: var(--color-primary, #e53935);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    }
  }

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-gray-4, #f5f5f5);

    img { width: 100%; height: 100%; object-fit: contain; }
  }

  &__ph {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-primary, #e53935);
  }

  &__name {
    font-size: 13px;
    color: var(--sd-color-txt-secondary, #666);
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__tag {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 0 5px;
    height: 15px;
    line-height: 15px;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    border-radius: 7px;

    &.is-hot { background: #ef4444; }
    &.is-new { background: #22c55e; }
  }
}
</style>
