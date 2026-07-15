<template>
  <!--
    游戏与彩票的摆放:这是「内容区」级区块,通常由首页(Home)引用:
      <Region name="gameLottery" />
    base 用具名 slot 暴露「彩票区 / 游戏区」两块,主题可整体覆盖本组件来改摆放
    (上下堆叠 / 左右并排 / 宫格 …)。默认上下堆叠。
  -->
  <div class="game-lottery-region">
    <section class="gl-lottery"><slot name="lottery" /></section>
    <section class="gl-game"><slot name="game" /></section>
  </div>
</template>

<script setup lang="ts">
// base 无逻辑;仅定义默认摆放骨架。主题覆盖此组件即可自定义结构。
</script>

<style lang="scss" scoped>
.game-lottery-region {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
