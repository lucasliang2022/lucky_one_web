<template>
  <div
      class="ball-item"
      v-for="(ball, idx) in balls"
      :key="idx"
      @click="onBallClick(ball)"
      :class="{ 'selected': ball.isSelected, 'chm': showColdHot || showOmission, ['segmentation-' + methodCurrent.segmentation]: true }"
  >
    <div class="ball-wrapper">
      <div class="show-number">
        <div class="display-left">
          <span :class="['ball-title', {'ball-circle': useCircle, [ball.color + '-bg']: ball.color }]">{{ ball.title }}</span>
          <div class="extend-content" v-if="ball.extraContent && ball.extraContent.length > 0">
          <span
              v-for="(item, index) in ball.extraContent"
              :key="index"
              class="extra-ball"
              :class="[item.color + '-bg']"
          >{{ item.title }}</span>
          </div>
        </div>
        <div class="display-right">
          <div class="ball-price">
            {{ formatBallPrize(ball.prize) }}
          </div>
          <el-input
              class="ball-input"
              size="small"
              type="text"
              v-model="ball.amount"
              @input="updateAmount(ball)"
              @blur="clearEmptyAmount(ball)"
              @click.stop="selectInputValue($event)"
          />
        </div>
      </div>
    </div>
    <div class="show-chm" v-if="showColdHot || showOmission">
      <span class="ball-ch chm" v-if="showColdHot">
        <span :class="getHotColdClass(hotColdData[ball.value])">
          {{ hotColdData[ball.value] || 0 }}
        </span>
      </span>
      <span class="ball-m chm" v-if="showOmission">
        <span :class="getOmissionClass(omissionData[ball.value])">
          {{ omissionData[ball.value] || 0 }}
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { formatPrize } from '@/utils/common';
import {HotCold, MethodNumberItem, Omission} from "@/types";

const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  methodCurrent: {
    type: Object,
    required: true
  },
  ballData: {
    type: Object,
    required: true
  },
  sort: {
    type: Number,
    required: true
  },
  useCircle: {
    type: Boolean,
    default: false
  },
  useFormatPrize: {
    type: Boolean,
    default: false
  },
  calculateHotColdFn: {
    type: Function,
    required: true
  },
  calculateOmissionFn: {
    type: Function,
    required: true
  }
});

const {
  amount,
  reset,
  creditSelectedBalls,
  creditBetCount,
  showColdHot,
  showOmission,
  selectedRange,
  issueHistory,
} = storeToRefs(props.store);

const hotColdData:HotCold = ref({});
const omissionData:Omission = ref({});

const balls = ref(
    props.ballData.map((item: MethodNumberItem) => ({
      value: item.value,
      title: item.title,
      amount: '',
      sign: props.methodCurrent.sign,
      prize: getPrizeForBall(item.value),
      isSelected: false,
    }))
);

function getPrizeForBall(ballValue) {
  const levels = props.methodCurrent?.levels ?? [];
  if (!levels.length) return 0;
  const valueStr = String(ballValue);
  const level = levels.find(l => l.codes.length === 0 || l.codes.includes(valueStr));
  if (!level) return 0;
  return typeof level.prize === 'number' ? level.prize : 0;
}

const formatBallPrize = (prize) => props.useFormatPrize ? formatPrize(prize) : prize;

watch(
    () => props.methodCurrent,
    (newMethod) => {
      if (newMethod && newMethod.layout && newMethod.sign) {
        balls.value = Object.entries(props.ballData).map(([key, value]) => {
          const existing = creditSelectedBalls.value[newMethod.sign]?.find(
              item => item.sign === newMethod.sign && item.value === key // 使用 key 进行匹配
          );
          return {
            value: key,
            title: key,
            amount: existing ? existing.amount.toString() : '',
            sign: newMethod.sign,
            prize: getPrizeForBall(key),
            isSelected: false
          };
        });
        creditSelectedBalls.value[newMethod.sign] = [];
      }
    },
    { immediate: true }
);

watch(
    () => reset.value,
    (newReset) => {
      if (newReset && props.methodCurrent?.sign) {
        balls.value = balls.value.map(ball => ({
          ...ball,
          amount: '',
          isSelected: false
        }));
        creditBetCount.value = 0;
        creditSelectedBalls.value[props.methodCurrent.sign] = [];
        hotColdData.value = {};
        omissionData.value = {};
        showColdHot.value = false;
        showOmission.value = false;
      }
    }
);

watch(
    () => amount.value,
    (newAmount) => {
      if (props.methodCurrent?.sign && newAmount > 0) {
        balls.value.forEach(ball => {
          if (ball.isSelected) {
            ball.amount = newAmount.toString();
            updateCreditSelectedBalls(ball);
          }
        });
      }
    }
);

watch(
    () => [showColdHot.value, showOmission.value, issueHistory.value, selectedRange.value],
    ([newColdHot, newOmission, newHistory, newRange]) => {
      if (newHistory && newHistory.length) {
        if (newColdHot) props.calculateHotColdFn(newRange, hotColdData);
        if (newOmission) props.calculateOmissionFn(omissionData);
      } else {
        balls.value.forEach(ball => {
          if (!newColdHot) ball.hotCount = null;
          if (!newOmission) ball.omission = null;
        });
      }
    }
);

function onBallClick(ball) {
  ball.isSelected = !ball.isSelected;
  ball.amount = ball.isSelected ? amount.value.toString() : '';
  updateCreditSelectedBalls(ball);
}

function clearEmptyAmount(ball) {
  if (!ball.amount) {
    ball.isSelected = false;
    updateCreditSelectedBalls(ball);
  }
}

function updateAmount(ball) {
  const value = ball.amount.trim();
  const numValue = parseInt(value.replace(/[^0-9]/g, ''));
  if (isNaN(numValue) || numValue <= 1) {
    ball.amount = '';
    ball.isSelected = false;
  } else {
    ball.amount = numValue.toString();
    ball.isSelected = true; // 输入有效值时自动选中
  }
  updateCreditSelectedBalls(ball);
}

function selectInputValue(event) {
  if (event.target.value) {
    event.target.select();
  }
}

function updateCreditSelectedBalls(ball) {
  if (!props.methodCurrent?.sign) return;

  const methodSign = props.methodCurrent.sign;
  if (!creditSelectedBalls.value[methodSign]) {
    creditSelectedBalls.value[methodSign] = [];
  }

  const newItem = {
    methodTitle: props.methodCurrent.title,
    methodSign: props.methodCurrent.sign,
    value: ball.value,
    title: ball.title,
    prize: ball.prize,
    amount: parseInt(ball.amount) || 0
  };

  const opposition = props.methodCurrent.layout?.opposition || [];
  const currentSelected = creditSelectedBalls.value[methodSign];

  // 如果有 opposition，且当前球有值，移除互斥选项
  if (opposition.length > 0 && newItem.amount > 0) {
    const oppositionValues = opposition.map(String); // 确保类型一致

    // 移除所有在 opposition 中的现有选项（除了当前选项）
    creditSelectedBalls.value[methodSign] = currentSelected.filter(
        item => !oppositionValues.includes(String(item.value)) || item.value === newItem.value
    );

    // 更新 balls 中的状态，移除其他互斥选项的值
    balls.value.forEach(b => {
      if (oppositionValues.includes(String(b.value)) && b.value !== newItem.value) {
        b.isSelected = false;
        b.amount = '';
      }
    });
  }

  // 更新 creditSelectedBalls
  const existingIndex = currentSelected.findIndex(
      item => item.methodSign === newItem.methodSign && item.value === newItem.value
  );

  if (newItem.amount > 0) {
    if (existingIndex !== -1) {
      creditSelectedBalls.value[methodSign][existingIndex].amount = newItem.amount;
    } else {
      creditSelectedBalls.value[methodSign].push(newItem);
    }
  } else if (existingIndex !== -1) {
    creditSelectedBalls.value[methodSign].splice(existingIndex, 1);
  }

  creditBetCount.value = calculateBetCount(creditSelectedBalls.value);
}

function calculateBetCount(creditSelected) {
  return Object.values(creditSelected).reduce((total, arr) => total + arr.length, 0);
}

function getHotColdClass(count) {
  const allCounts = Object.values(hotColdData.value).filter(c => c !== null);
  if (!allCounts.length) return '';
  const max = Math.max(...allCounts);
  const min = Math.min(...allCounts);
  return count === max ? 'hot' : count === min ? 'cold' : '';
}

function getOmissionClass(omission) {
  const allOmissions = Object.values(omissionData.value).filter(o => o !== null);
  if (!allOmissions.length) return '';
  const max = Math.max(...allOmissions);
  const min = Math.min(...allOmissions);
  return omission === max ? 'max-omission' : omission === min ? 'min-omission' : '';
}
</script>