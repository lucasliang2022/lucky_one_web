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
      <el-carousel :initial-index="activeIndex" arrow="always" height="50vh">
        <el-carousel-item v-for="(item, index) in noticeList" :key="index">
          <div class="carousel-item-content">
            <h3 class="notice-title">{{ item.title }}</h3>
            <div class="notice-meta">
              <span class="notice-time">{{ item.created_at }}</span>
              <span v-if="item.category_label" class="notice-cat">{{ item.category_label }}</span>
            </div>
            <div class="notice-body" v-html="item.content"></div>
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
import * as systemService from '@shared/api/systemService';

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
    const res = await systemService.fetchNoticeList();
    // 后端返回 { items, total };取 items
    noticeList.value = res?.items ?? (Array.isArray(res) ? res : []);
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
  fetchNotices();
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

  /* 轮播公告弹窗样式:标题 → 时间+分类 → 正文,自上而下 */
  .carousel-item-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    /* 左右留足 gutter,避免被两侧「上一条/下一条」箭头盖住内容 */
    padding: 12px 58px;
    box-sizing: border-box;
    text-align: left;

    /* 标题 */
    .notice-title {
      margin: 0;
      font-size: 17px;
      font-weight: bold;
      color: #303133;
      text-align: center;
      line-height: 1.4;
    }

    /* 标题下一行:时间 + 分类 */
    .notice-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin: 6px 0 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 12px;
      font-weight: normal;

      .notice-time {
        color: #909399;
      }

      .notice-cat {
        display: inline-block;
        padding: 1px 8px;
        border-radius: 10px;
        background-color: #ecf5ff;
        color: #409eff;
        font-size: 12px;
        line-height: 18px;
      }
    }

    /* 正文:可滚动,常规字重、左对齐易读 */
    .notice-body {
      flex: 1;
      overflow-y: auto;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.6;
      color: #606266;
      word-break: break-word;
    }
  }
</style>

