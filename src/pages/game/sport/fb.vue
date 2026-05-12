<template>
  <div class="sport-fb-page">
    <ThirdGameFrame
        v-if="fbGame"
        :platform-sign="fbGame.sign"
        :account-sign="fbGame.account_sign"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useCommonStore } from '@/stores/commonStore';
import ThirdGameFrame from '@/components/game/ThirdGameFrame.vue';

const commonStore = useCommonStore();
const fbGame = computed(() =>
    commonStore.thirdGameList?.sport?.find(g => g.sign === 'fb')
);
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