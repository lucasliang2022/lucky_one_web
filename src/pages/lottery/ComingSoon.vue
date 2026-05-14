<template>
  <div class="coming-soon">
    <div class="cs-inner">
      <div class="cs-icon">🎰</div>
      <div class="cs-title">
        {{ titleByCategory[category as string] || '该彩种' }} 即将上线
      </div>
      <div class="cs-desc">敬请期待，更多玩法精彩呈现</div>
      <el-button type="primary" round size="large" @click="goHome">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps<{
  category?: string;
  sign?: string;
}>();

const router = useRouter();
const goHome = () => router.push('/');

const titleByCategory: Record<string, string> = {
  ssc:   '时时彩',
  sd:    '急速3D',
  ks:    '快三',
  lhc:   '六合彩',
  pk10:  '极速赛车',
  lotto: '传统乐透',
  p3p5:  '排列三/五',
  kl28:  '快乐28',
  hash:  '区块链5D',
};
</script>

<style lang="scss" scoped>
.coming-soon {
  width: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f0f7ff 100%);

  .cs-inner {
    text-align: center;
    padding: 60px 80px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  }

  .cs-icon {
    font-size: 80px;
    margin-bottom: 24px;
  }

  .cs-title {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 12px;
  }

  .cs-desc {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 32px;
  }
}
</style>