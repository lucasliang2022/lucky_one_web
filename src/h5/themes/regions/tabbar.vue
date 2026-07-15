<template>
  <!-- 公共区块:底部标签栏(5 项,中间"加盟"悬浮凸起)。
       van-tabbar route 模式:按当前路由自动高亮,item 用 to 跳转。
       中间"加盟"用 icon slot 自绘圆形,负 margin 上移凸出(正常流,不绝对定位、不压文字)。
       皮肤如需自定义可在 skins/<sign>/regions/tabbar.vue 覆盖本文件。 -->
  <van-tabbar route class="h5-tabbar">
    <van-tabbar-item icon="home-o" to="/">{{ t('h5.tab.home') }}</van-tabbar-item>
    <van-tabbar-item icon="gift-o" to="/activity">{{ t('h5.tab.activity') }}</van-tabbar-item>

    <!-- 中间"加盟":凸起圆形按钮,不带文字 -->
    <van-tabbar-item to="/join" class="h5-tabbar__center">
      <template #icon>
        <div class="h5-tabbar__raised">
          <van-icon name="friends-o" />
        </div>
      </template>
    </van-tabbar-item>

    <van-tabbar-item icon="gold-coin-o" to="/recharge">{{ t('h5.tab.recharge') }}</van-tabbar-item>
    <van-tabbar-item icon="manager-o" to="/mine">{{ t('h5.tab.account') }}</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { t } from '@shared/i18n';
</script>

<style lang="scss">
.h5-tabbar {
  // 允许中间圆凸出于栏之外(否则被裁掉)
  overflow: visible;

  .h5-tabbar__center {
    overflow: visible;

    // van-tabbar-item 内部是纵向 flex(icon 在上、文字在下)。
    // 用负 margin 把圆整体上移凸出,文字仍在正常流里跟在圆下方,两者不重叠。
    .h5-tabbar__raised {
      margin-top: -26px;
      margin-bottom: 4px;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: #fff;
      font-size: 26px;
      background: linear-gradient(135deg, var(--van-primary-color, #1989fa), #39a9ff);
      box-shadow: 0 4px 10px rgba(25, 137, 250, 0.45);
      border: 3px solid var(--h5-color-bg, #f7f8fa);
    }
  }
}
</style>
