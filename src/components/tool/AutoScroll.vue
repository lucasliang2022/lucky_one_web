<template>
  <div class="scroll-wrapper">
    <div class="notice-icon">
        <span class="sd-font icon-sd-notice" style="font-size: 20px; color: #999999;"></span>
    </div>
    <div class="scroll-container" ref="scrollContainer" @mouseover="stopScroll" @mouseleave="startScroll">
      <ul class="scroll-content" ref="scrollContent">
        <li
            v-for="(item, index) in noticeList"
            :key="index"
            class="scroll-item"
            @click="openNoticeDialog(index)"
        >
          {{ item.title }}
        </li>
        <li
            v-for="(item, index) in noticeList"
            :key="'clone-' + index"
            class="scroll-item"
            @click="openNoticeDialog(index)"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>

    <el-dialog v-model="dialogVisible" width="40%" class="notice-dialog">
      <template #header>
        <div class="custom-dialog-title">平台公告</div>
      </template>
      <el-carousel :initial-index="activeIndex" arrow="always" height="200px">
        <el-carousel-item v-for="(item, index) in noticeList" :key="index">
          <div class="carousel-item-content">
            <h3>{{ item.title }}</h3>
            <p v-html="item.content"></p>
          </div>
        </el-carousel-item>
      </el-carousel>
      <template #footer>
        <span class="dialog-footer">
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import api from "@/api/index.ts";
import * as systemService from '@/api/systemService';
import {fetchNoticeList} from "@/api/systemService";

const props = defineProps({
  speed: {
    type: Number,
    default: 1,
  },
});

const scrollContainer = ref(null);
const scrollContent = ref(null);
const noticeList = ref([]);
const dialogVisible = ref(false);
const activeIndex = ref(0);
let lastTimestamp = 0;
let animationFrameId = null;

const fetchNotices = async () => {
  try {
    const data = systemService.fetchNoticeList()
    noticeList.value = data || [];
    startScroll();
  } catch (error) {
    console.error('获取公告失败:', error);
  }
};

const scroll = (timestamp) => {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
  }
  const progress = timestamp - lastTimestamp;
  if (progress >= 1000 / (props.speed * 10)) {
    scrollContainer.value.scrollLeft += 1;
    lastTimestamp = timestamp;
  }
  if (scrollContainer.value.scrollLeft >= scrollContent.value.scrollWidth / 2) {
    scrollContainer.value.scrollLeft = 0;
  }
  animationFrameId = requestAnimationFrame(scroll);
};

const startScroll = () => {
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(scroll);
  }
};

const stopScroll = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

// 打开弹窗并设置当前索引
const openNoticeDialog = (index) => {
  activeIndex.value = index;
  dialogVisible.value = true;
};

onMounted(() => {
  fetchNoticeList();
});

onBeforeUnmount(() => {
  stopScroll();
});

watch(() => props.speed, () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    startScroll();
  }
});
</script>

<style lang="scss" scoped>
  .scroll-wrapper {
    display: flex;
    justify-content: left;
    align-items: center;
    width: 80%;
    .notice-icon {
      display: flex;
      justify-content: center;
      margin-right: 5px;
    }
  }
  .scroll-container {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
  }

  .scroll-content {
    display: flex;
    white-space: nowrap;
    margin-left: 32px;
    cursor: pointer;
  }

  .scroll-item {
    display: inline-flex;
    align-items: center;
    padding: 0 10px;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: #409eff;
    }
  }

  ::v-deep(.notice-dialog) {
    padding: 0;
  }

  ::v-deep(.el-dialog__header) {
    padding-right: 0;
  }

  /* Dialog title with background color */
  .custom-dialog-title {
    background-color: rgb(246, 249, 254, var(--tw-bg-opacity));
    color: #000;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }

  /* 轮播公告弹窗样式 */
  .carousel-item-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
</style>

