<template>
  <!-- 找到了对应平台 → 拉游戏 -->
  <ThirdGameFrame
      v-if="matched"
      :platform-sign="matched.sign"
      :account-sign="matched.account_sign"
  />

  <!-- 没找到 → 友好提示 + 返回分类首页 -->
  <div v-else-if="commonStore.isLoaded" class="game-not-found">
    <el-result icon="warning" :title="t('pages.game.platformNotFound')">
      <template #sub-title>
        <span>{{ t('pages.game.platformNotFoundDesc') }}</span>
      </template>
      <template #extra>
        <el-button type="primary" @click="goBack">
          {{ t('pages.game.backToCategory') }}
        </el-button>
      </template>
    </el-result>
  </div>

  <!-- store 没加载完 → 占位 -->
  <div v-else class="loading-placeholder">
    <el-icon class="loading-icon" :size="40"><Loading /></el-icon>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Loading } from '@element-plus/icons-vue';
import { useCommonStore } from '@/stores/commonStore';
import ThirdGameFrame from '@/components/game/ThirdGameFrame.vue';

const props = defineProps<{
  category: string;
  sign: string;
}>();

const { t } = useI18n();
const router = useRouter();
const commonStore = useCommonStore();

/** 从 commonStore 找对应平台（要同时拿 account_sign 才能发起 launch）*/
const matched = computed(() =>
    commonStore.thirdGameList?.[props.category]?.find(g => g.sign === props.sign)
);

const goBack = () => router.push(`/game/${props.category}`);
</script>

<style lang="scss" scoped>
.game-not-found,
.loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
}

.loading-icon {
  color: #326BC7;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0); }
  to   { transform: rotate(360deg); }
}
</style>