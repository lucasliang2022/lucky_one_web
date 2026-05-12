<template>
  <div class="sport-fb-page">
    <!-- 子导航：在多个体育平台间切换 -->
    <div v-if="sportPlatforms.length > 1" class="sport-sub-nav">
      <router-link
          v-for="p in sportPlatforms"
          :key="p.sign"
          :to="`/game/sport/${p.sign}`"
          class="sub-nav-item"
          :class="{ active: p.sign === sign }"
      >
        {{ p.title }}
      </router-link>
    </div>

    <!-- 游戏主体 -->
    <ThirdGameFrame :sign="sign" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useCommonStore } from '@/stores/commonStore';
import ThirdGameFrame from '@/components/game/ThirdGameFrame.vue';

const sign = 'fb';
const commonStore = useCommonStore();

const sportPlatforms = computed(() => commonStore.thirdGameList?.sport ?? []);
</script>

<style lang="scss" scoped>
.sport-fb-page { display: flex; flex-direction: column; }

.sport-sub-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 20px;
  background-color: #1a1a2e;
  border-bottom: 1px solid #333;

  .sub-nav-item {
    padding: 6px 16px;
    border-radius: 4px;
    color: #ccc;
    text-decoration: none;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover  { color: #fff; background-color: #326BC7; }
    &.active { color: #fff; background-color: #326BC7; font-weight: 600; }
  }
}
</style>