<template>
  <div class="home-page">
    <el-carousel height="400px">
      <el-carousel-item v-for="item in banners" :key="item">
        <img :src="item" alt="banner" class="banner-image" />
      </el-carousel-item>
    </el-carousel>

    <el-row :gutter="20" class="lottery-section">
      <el-col :span="6" v-for="(item, index) in lotteries" :key="index">
        <el-card class="lottery-card">
          <img :src="item.icon" class="lottery-icon" />
          <div class="lottery-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <el-button type="primary">立即投注</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const banners = ref([
  'https://raketcontent.com/1/Screenshot_2024_06_14_16_01_20_400_de7bfd1b8a.jpeg',
  'https://img.freepik.com/free-vector/kids-learning-playing-illustration_53876-40285.jpg',
  'https://img.freepik.com/free-vector/set-family-activities_1262-19893.jpg',
])

const lotteries = ref([
  {name: '如意快3', description: '1分钟1期', icon: '/static/img/k3.png'},
  {name: '大发快3', description: '快速开奖', icon: '/static/img/k3.png'},
  {name: '幸运时时彩', description: '全天开奖', icon: '/static/img/ssc.png'},
  {name: '极速PK10', description: '极速赛车', icon: '/static/img/pk10.png'}
])
</script>

<style scoped>
.home-page {
  width: 100%;
  overflow-x: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lottery-section {
  margin-top: 40px;
  padding: 0 40px;
}

.lottery-card {
  text-align: center;
  padding: 20px;
}

.lottery-icon {
  width: 100px;
  height: 100px;
}
</style>
