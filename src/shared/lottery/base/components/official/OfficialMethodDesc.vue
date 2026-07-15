<template>
  <div class="method-info">
    <div class="info-left">
      <div class="method-name">{{ resolveMethodTitle(officialMethodCurrent, t, te) }}</div>
      <div class="method-prize">
        <span class="prize-info">
          <span>
            <span>奖金：</span>
            <span class="prize-value">{{ displayPrize }}</span> 元
          </span>
        </span>
        <el-tooltip v-if="hasMultipleLevels" popper-class="multiple-prize" effect="dark" placement="top">
          <template #content>
            <ul class="tooltip-list">
              <li v-for="(level, index) in levels" :key="index">
                {{ level.title }}: {{ level.prize }} 元
              </li>
            </ul>
          </template>
          <i class="icon-sd icon-sd-info1"></i>
        </el-tooltip>
      </div>
      <div class="method-note" @click="toggleDesc">
        <i :class="['icon-sd', isDescShow ? 'icon-sd-check_square' : 'icon-sd-square_empty']"></i><span>玩法说明</span>
        <span v-if="isDescShow" class="desc-arrow"></span>
      </div>
    </div>
    <div class="method-desc-right" v-if="hasLrStatus && hasYlStatus">
      <div class="method-mch">
        <div v-if="showColdHot" class="issue-count">
          <div :class="{ active: selectedRange === 20 }" @click="setSelectedRange(20)">20</div>
          <div :class="{ active: selectedRange === 50 }" @click="setSelectedRange(50)">50</div>
          <div :class="{ active: selectedRange === 100 }" @click="setSelectedRange(100)">100</div>
        </div>

        <!-- Cold/Hot Toggle -->
        <el-tooltip popper-class="cold-hot-tips" raw-content effect="dark" content="<div>指选择的期数内，号码或形态的出现次数。出现最多的用<span style='color:#ff8989'>红色</span>显示，最少的用<span style='color:#21cafe'>蓝色</span>显示。</div>" placement="top">
          <div class="el-tooltip cold-hot" :class="{ active: showColdHot }" @click="toggleColdHot">
            <i :class="['icon-sd', showColdHot ? 'icon-sd-radio-checked' : 'icon-sd-radio-unchecked']"></i>
            <i>冷热</i>
          </div>
        </el-tooltip>

        <!-- Omission Toggle -->
        <el-tooltip popper-class="omission-tips" raw-content effect="dark" content="<div>即当前遗漏，指该号码或形态，从上次开出至当前的间隔期数。同一位置，最大的遗漏数值用<span style='color:#ff8989'>红色</span>显示；最小的用<span style='color:#21cafe'>蓝色</span>显示。</div>" placement="top">
          <div class="el-tooltip miss" :class="{ active: showOmission }" @click="toggleOmission">
            <i :class="['icon-sd', showOmission ? 'icon-sd-radio-checked' : 'icon-sd-radio-unchecked']"></i>
            <i>当前遗漏</i>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
  <div v-if="isDescShow" class="method-desc">
    <span class="desc-label">玩法说明：</span>{{ officialMethodCurrent.desc }}<br>
    <span class="desc-label">中奖范例：</span>{{ officialMethodCurrent.example }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { formatPrize } from '@shared/utils/common.ts';
import { useI18n } from 'vue-i18n';
import { resolveMethodTitle } from '@lottery/base/utils/common';

const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
});

const {
  officialMethodCurrent,
  displayPrize: displayPrizeRef,
  showColdHot,
  showOmission,
  selectedRange,
  isDescShow,
  price,
} = storeToRefs(props.store);

const { toggleDesc, toggleColdHot, toggleOmission, setSelectedRange } = props.store;
const { t, te } = useI18n();

const hasLrStatus = computed(() => officialMethodCurrent.value?.lr_status === true);
const hasYlStatus = computed(() => officialMethodCurrent.value?.yl_status === true);

const levels = computed(() => {
  const prizeData = displayPrizeRef.value.length ? displayPrizeRef.value : (officialMethodCurrent.value?.levels ?? []);
  return Array.isArray(prizeData) ? prizeData : [];
});

const hasMultipleLevels = computed(() => levels.value.length > 1);

const displayPrize = computed(() => {
  if (!Array.isArray(levels.value) || levels.value.length === 0) {
    return 'N/A';
  }

  if (levels.value.length === 1) {
    const prizeStr = String(levels.value[0].prize);
    const prizeNum = parseFloat(prizeStr);
    const prizeValue = isNaN(prizeNum) ? 0 : prizeNum;
    return formatPrize(prizeValue, price.value);
  }

  const numericPrizes: number[] = [];
  for (const level of levels.value) {
    const prizeStr = String(level.prize);
    const prizeNum = parseFloat(prizeStr);

    if (!isNaN(prizeNum)) {
      numericPrizes.push(prizeNum);
    }
  }

  if (numericPrizes.length === 0) {
    return 'N/A';
  }

  const minPrizeValue = Math.min(...numericPrizes);
  const maxPrizeValue = Math.max(...numericPrizes);

  const minPrizeFormatted = formatPrize(minPrizeValue, price.value);
  const maxPrizeFormatted = formatPrize(maxPrizeValue, price.value);

  if (minPrizeValue === maxPrizeValue) {
    return minPrizeFormatted;
  } else {
    return `${minPrizeFormatted} ~ ${maxPrizeFormatted}`;
  }
});
</script>
<style>
.multiple-prize.is-dark, .multiple-prize.is-dark>.el-popper__arrow:before {
  background-color: #1c9eff !important;
  border: 1px solid #1c9eff !important;
}
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
    justify-content: flex-start;
    .method-name {
      border-radius: 4px;
      background-color: #eff8ff;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      color: #179dff;
      padding: 0 8px;
      margin: 0 15px;
    }
    .method-prize {
      margin-right: 10px;
    }
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
      .desc-arrow {
        position: absolute;
        display: inline-block;
        top: 24px;
        left: -2px;
        height: 16px;
        width: 16px;
        content: "";
        border-color: #e1e6ea #e1e6ea transparent transparent;
        border-style: solid;
        border-width: 1px;
        transform: rotate(-45deg);
        z-index: 1000;
        background-color: #fff;
      }
    }
  }
}
.method-desc {
  padding: 10px 20px;
  margin: 3px 9px;
  font-size: 12px;
  color: #151515;
  line-height: 17px;
  border-radius: 6px;
  background-color: #fff;
  position: relative;
  border: 1px solid #dbd7e6;
  text-align: left;
  z-index: 30;
  .desc-label {
    font-weight: 600;
  }
}
.method-prize {
  display: flex;
  align-items: center;
  line-height: 1;
  gap: 5px;
  i {
    color: #8a8a8a;
  }
  .prize-value {
    font-weight: bold;
    color: #ff8c00;
    font-size: 14px;
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
</style>