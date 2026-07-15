<template>
  <!--
    默认首页(page/default/index)。page-home 是「主题化契约」的稳定钩子:
    主题在 themes/{sign}/main.css 里用 [data-sign="X"] .page-home ... 就能改本页样式,无需改本组件。
    内容由区块拼装:重要彩票入口 + 各游戏入口(体育/真人/电子/棋牌)。
    homeGame 一个区块按 category 复用摆多次;某分类无数据时该块自动隐藏。
  -->
  <div class="page-home">
    <el-carousel height="400px" class="page-home__banner">
      <el-carousel-item v-for="item in banners" :key="item">
        <img :src="item" alt="banner" class="page-home__banner-img" />
      </el-carousel-item>
    </el-carousel>

    <div class="page-home__body">
      <Region name="homeLottery" />
      <Region name="homeGame" category="sport" />
      <Region name="homeGame" category="live" />
      <Region name="homeGame" category="slot" />
      <Region name="homeGame" category="e_sport" />
      <Region name="homeGame" category="mini_game" />
      <Region name="homeGame" category="chess" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Region from '@web/themes/Region.vue';

const banners = ref<string[]>([
  'https://raketcontent.com/1/Screenshot_2024_06_14_16_01_20_400_de7bfd1b8a.jpeg',
  'https://img.freepik.com/free-vector/kids-learning-playing-illustration_53876-40285.jpg',
  'https://img.freepik.com/free-vector/set-family-activities_1262-19893.jpg',
]);
</script>

<style scoped>
.page-home {
  width: 100%;
  overflow-x: hidden;
}

.page-home__banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-home__body {
  padding-bottom: 32px;
}
</style>
