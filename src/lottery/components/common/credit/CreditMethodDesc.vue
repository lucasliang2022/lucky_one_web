<template>
  <div class="method-info">
    <div class="info-left">
      <div class="method-note" @click="toggleDesc">
        <i :class="['icon-sd', dialogVisible ? 'icon-sd-check_square' : 'icon-sd-square_empty']"></i><span>玩法说明</span>
      </div>
    </div>
    <div class="method-desc-right" v-if="hasLrStatus || hasYlStatus">
      <div class="method-mch">
        <div v-if="showColdHot" class="issue-count">
          <div :class="{ active: selectedRange === 20 }" @click="setSelectedRange(20)">20</div>
          <div :class="{ active: selectedRange === 50 }" @click="setSelectedRange(50)">50</div>
          <div :class="{ active: selectedRange === 100 }" @click="setSelectedRange(100)">100</div>
        </div>
        <el-tooltip popper-class="cold-hot-tips" raw-content effect="dark" content="<div>指选择的期数内，号码或形态的出现次数。出现最多的用<span style='color:#ff8989'>红色</span>显示，最少的用<span style='color:#21cafe'>蓝色</span>显示。</div>" placement="top">
          <div class="el-tooltip cold-hot" :class="{ active: showColdHot }" @click="toggleColdHot">
            <i :class="['icon-sd', showColdHot ? 'icon-sd-radio-checked' : 'icon-sd-radio-unchecked']"></i>
            <i>冷热</i>
          </div>
        </el-tooltip>
        <el-tooltip popper-class="omission-tips" raw-content effect="dark" content="<div>即当前遗漏，指该号码或形态，从上次开出至当前的间隔期数。同一位置，最大的遗漏数值用<span style='color:#ff8989'>红色</span>显示；最小的用<span style='color:#21cafe'>蓝色</span>显示。</div>" placement="top">
          <div class="el-tooltip miss" :class="{ active: showOmission }" @click="toggleOmission">
            <i :class="['icon-sd', showOmission ? 'icon-sd-radio-checked' : 'icon-sd-radio-unchecked']"></i>
            <i>当前遗漏</i>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" width="70%" :close-on-click-modal="false">
    <template #header>
      <span>玩法说明</span> - <span style="color: #409eff">{{ t(creditGroupCurrent.title) }}</span>
    </template>
    <el-table :data="methodDescData" border style="width: 100%">
      <el-table-column prop="title" label="玩法名称" width="150"></el-table-column>
      <el-table-column label="内容">
        <template #default="{ row }">
          <div v-for="(item, index) in row.content" :key="index" class="content-item">
            <span v-if="item.title" class="content-title" style="color: #409eff">{{ item.title }}：</span>
            <span>{{ item.content }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="example" label="示例" width="320"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();

const {
  creditGroupCurrent,
  showColdHot,
  showOmission,
  selectedRange,
  isDescShow,
} = storeToRefs(props.store);

const { toggleDesc, toggleColdHot, toggleOmission, setSelectedRange } = props.store;

const dialogVisible = ref(false);

// 计算是否有任意 lr_status 或 yl_status 为 true
const hasLrStatus = computed(() => {
  return creditGroupCurrent.value?.methods &&
      Object.values(creditGroupCurrent.value.methods).some(method => method.lr_status === true);
});

const hasYlStatus = computed(() => {
  return creditGroupCurrent.value?.methods &&
      Object.values(creditGroupCurrent.value.methods).some(method => method.yl_status === true);
});

const methodDescData = computed(() => {
  if (!creditGroupCurrent.value?.methods) return [];
  return Object.entries(creditGroupCurrent.value.methods).map(([sign, method]) => ({
    sign,
    title: method.desc?.title,
    content: method.desc?.content || [{ title: '暂无标题', content: '暂无内容' }],
    example: method.desc?.example || '暂无示例'
  }));
});

watch(isDescShow, (newVal) => dialogVisible.value = newVal);
watch(dialogVisible, (newVal) => isDescShow.value = newVal);
</script>

<style>
.omission-tips.is-dark, .cold-hot-tips.is-dark {
  width: 250px !important;
}
</style>

<style lang="scss" scoped>
.icon-sd {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  vertical-align: middle;
  cursor: pointer;
}
.method-info {
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  width: 100%;
  color: #333;
  position: relative;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  background: #f9fbff;
  border-top: 1px solid #dee3e8;
  border-bottom: 1px solid #dee3e8;
  gap: 15px;
  .info-left {
    display: flex;
    margin-left: 20px;
    justify-content: flex-start;
    .method-note {
      cursor: pointer;
      display: flex;
      align-items: center;
      position: relative;
      gap: 1px;
      span {
        font-size: 12px;
        line-height: 1;
      }
    }
  }
}
.method-mch {
  display: flex;
  align-items: center;
  gap: 10px;
  .issue-count {
    display: flex;
    gap: 5px;
  }
  .issue-count div {
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 4px;
  }
  .issue-count div.active {
    background-color: #409eff;
    color: white;
    font-weight: bold;
  }
}
.el-tooltip {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  line-height: 1;
  .icon-sd {
    margin-right: 3px;
    color: #999;
  }
  &.active {
    background-color: #409eff;
    color: white;
    .icon-sd {
      margin-right: 3px;
      color: white;
    }
  }
}
.content-item {
  margin-bottom: 5px;
}
.content-title {
  font-weight: bold;
}
</style>