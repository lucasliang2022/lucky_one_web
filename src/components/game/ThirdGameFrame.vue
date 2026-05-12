<template>
  <div class="third-game-frame" :style="{ background: bgColor }">

    <!-- 加载中 -->
    <div v-if="loading" class="loading-mask">
      <img v-if="gameConfig?.logo" :src="gameConfig.logo" class="platform-logo" alt="logo" />
      <el-icon class="loading-icon" :size="40"><Loading /></el-icon>
    </div>

    <!-- 错误 -->
    <div v-else-if="error" class="error-mask">
      <el-result icon="error" :title="error">
        <template #extra>
          <el-button type="primary" @click="relaunch">{{ t('common.retry') }}</el-button>
        </template>
      </el-result>
    </div>

    <!-- iframe -->
    <iframe
        v-else-if="launchUrl"
        :src="launchUrl"
        class="game-iframe"
        frameborder="0"
        allowfullscreen
        :scrolling="gameConfig?.iframe_scrolling ? 'yes' : 'no'"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Loading } from '@element-plus/icons-vue';
import { useGameLaunch } from '@/composables/useGameLaunch';

const props = defineProps<{
  platformSign: string;
  accountSign: string;
}>();

const { t } = useI18n();
const { launchUrl, gameConfig, loading, error, relaunch } = useGameLaunch(props.platformSign, props.accountSign);

const bgColor = computed(() => gameConfig.value?.theme_color ?? '#0F1923');
</script>

<style lang="scss" scoped>
.third-game-frame {
  position: relative;
  width: 100%;
  height: calc(100vh - 120px);  // 减去 header + nav 高度
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .loading-mask,
  .error-mask {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .platform-logo {
    height: 60px;
    object-fit: contain;
  }

  .loading-icon {
    color: #fff;
    animation: spin 1s linear infinite;
  }

  .game-iframe {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
}

@keyframes spin {
  from { transform: rotate(0); }
  to   { transform: rotate(360deg); }
}
</style>