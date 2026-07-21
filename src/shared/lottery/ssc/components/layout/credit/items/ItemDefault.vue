<template>
  <div
      class="ball-item"
      v-for="(ball, idx) in balls"
      :key="idx"
      @click="onBallClick(ball)"
      :class="{
        'selected': ball.isSelected,
        'chm': showColdHot || showOmission,
        ['segmentation-' + methodCurrent.segmentation]: true,
        'ball-clicked': ball.justClicked
      }"
  >
    <div class="ball-wrapper">
      <div class="show-number">
        <div class="display-left">
          <span :class="['ball-title', { 'ball-circle': ball.isCircle, [ball.color + '-bg']: ball.color }]">{{ tt(ball.title) }}</span>
          <div class="extend-content" v-if="ball.extraContent && ball.extraContent.length > 0">
          <span
              v-for="(item, index) in ball.extraContent"
              :key="index"
              class="extra-ball"
              :class="[item.color + '-bg']"
          >{{ tt(item.title) }}</span>
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
import { formatPrize } from '@shared/utils/common.ts';
import { resolveMethodTitle } from '@lottery/base/utils/common';
import { useI18n } from 'vue-i18n';

const { t, te } = useI18n();
// 数字格子(如 0-9)title 就是数字,不是 i18n key;仅有翻译时才 t(),否则原样显示,避免告警。
const tt = (k: any) => (k && te(k) ? t(k) : k);
import { MethodNumberItem } from "@shared/types";
const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  methodCurrent: {
    type: Object,
    required: true
  },
  sort: {
    type: Number,
    required: true
  },
  useFormatPrize: {
    type: Boolean,
    default: false
  },
  calculateChm: {
    type: Function,
    required: true
  },
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

const hotColdData = ref({});
const omissionData = ref({});

const balls = ref(
    props.methodCurrent.layout.rows[0].number.map((item: MethodNumberItem) => ({
      value: item.value,
      title: item.title,
      isCircle: props.methodCurrent.layout.rows[0].shape | false,
      amount: '',
      sign: props.methodCurrent.sign,
      prize: getPrizeForBall(item.value),
      isSelected: false,
      justClicked: false
    }))
);

function getPrizeForBall(ballValue) {
  const levels = props.methodCurrent?.levels ?? [];
  if (!levels.length) return 0;
  const level = levels.find(l => l.codes.length === 0 || l.codes.includes(ballValue));
  if (!level) return 0;
  return level.prize;
}

const formatBallPrize = (prize) => props.useFormatPrize ? formatPrize(prize) : prize;

watch(
    () => props.methodCurrent,
    (newMethod) => {
      if (newMethod && newMethod.layout && newMethod.sign) {
        const shape = newMethod.layout.rows[0].shape;
        balls.value = newMethod.layout.rows[0].number.map(ball => {
          const existing = creditSelectedBalls.value[newMethod.sign]?.find(
              item => item.sign === newMethod.sign && item.value === ball.value
          );
          return {
            value: ball.value,
            title: ball.title,
            isCircle: shape === 'circle',
            amount: existing ? existing.amount.toString() : '',
            sign: newMethod.sign,
            prize: getPrizeForBall(ball.value),
            isSelected: false,
            justClicked: false
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
          isSelected: false,
          justClicked: false
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
        if (newColdHot) calculateHotCold(newRange, hotColdData);
        if (newOmission) calculateOmission(omissionData);
      }
    }
);

function onBallClick(ball) {
  ball.isSelected = !ball.isSelected;
  ball.amount = ball.isSelected ? amount.value.toString() : '';
  ball.justClicked = true;
  updateCreditSelectedBalls(ball);
  setTimeout(() => {
    ball.justClicked = false;
  }, 300);
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
    ball.isSelected = true;
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
    methodTitle: resolveMethodTitle(props.methodCurrent, t, te),
    methodSign: props.methodCurrent.sign,
    value: ball.value,
    title: ball.title,
    prize: ball.prize,
    amount: parseInt(ball.amount) || 0
  };

  const opposition = props.methodCurrent.layout?.opposition || [];
  const currentSelected = creditSelectedBalls.value[methodSign];

  if (opposition.length > 0 && newItem.amount > 0) {
    const oppositionValues = opposition.map(String);

    creditSelectedBalls.value[methodSign] = currentSelected.filter(
        item => !oppositionValues.includes(String(item.value)) || item.value === newItem.value
    );

    balls.value.forEach(b => {
      if (oppositionValues.includes(String(b.value)) && b.value !== newItem.value) {
        b.isSelected = false;
        b.amount = '';
      }
    });
  }

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

function calculateHotCold(issueCount, hotColdData) {
  if (!issueHistory.value?.length) {
    hotColdData.value = {};
    return;
  }
  const recentIssues = issueHistory.value.slice(0, issueCount);
  const hotCold = {};

  props.methodCurrent.layout.rows[0].number.forEach(ball => {
    hotCold[ball.value] = 0;
  });

  recentIssues.forEach(issue => {
    // calculateChm 可返回单值或「一期命中多个码」的数组(如大小单双质合、单码多位置)。
    const res = props.calculateChm(issue);
    const vals = (Array.isArray(res) ? res : [res]).filter(v => v !== null && v !== undefined);
    vals.forEach(v => { if (hotCold[v] !== undefined) hotCold[v] += 1; });
  });

  hotColdData.value = hotCold;
}

function calculateOmission(omissionData) {
  if (!issueHistory.value?.length) {
    omissionData.value = {};
    return;
  }

  const omission = {};
  props.methodCurrent.layout.rows[0].number.forEach(ball => {
    omission[ball.value] = -1;
  });

  for (let index = 0; index < issueHistory.value.length; index++) {
    const issue = issueHistory.value[index];
    const res = props.calculateChm(issue);
    const vals = (Array.isArray(res) ? res : [res]).filter(v => v !== null && v !== undefined);
    vals.forEach(v => { if (omission[v] === -1) omission[v] = index; });
    if (!Object.values(omission).includes(-1)) {
      break;
    }
  }

  for (let key in omission) {
    if (omission[key] === -1) {
      omission[key] = issueHistory.value.length;
    }
  }

  omissionData.value = omission;
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

<style scoped>
.ball-item {
  transition: transform 0.2s ease;
}

.ball-clicked {
  animation: scaleAnimation 0.2s ease;
}

@keyframes scaleAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.04);
  }
  100% {
    transform: scale(1);
  }
}
</style>