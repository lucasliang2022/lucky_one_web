<template>
  <ThirdGameFrame
      v-if="fbGame"
      platform-sign="fb"
      :account-sign="fbGame.account_sign"
  />

  <div v-else-if="commonStore.isLoaded" class="fb-not-enabled">
    <el-result icon="warning" :title="t('pages.game.platformNotFound')">
      <template #extra>
        <el-button type="primary" @click="$router.push('/game/sport')">
          {{ t('pages.game.backToCategory') }}
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@shared/stores/commonStore';
import ThirdGameFrame from '@web/common/game/ThirdGameFrame.vue';

const { t } = useI18n();
const commonStore = useCommonStore();

const fbGame = computed(() =>
    commonStore.thirdGameList?.sport?.find(g => g.sign === 'fb')
);
</script>

<style lang="scss" scoped>
.fb-not-enabled {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
}
</style>